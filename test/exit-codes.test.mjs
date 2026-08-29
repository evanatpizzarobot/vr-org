import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Exit codes are the load-bearing contract behind every gate on this branch:
// FAIL vs REVIEW, the advisory-never-blocks promise of check:same-date, and
// the refuse-rather-than-guess promise of the network gates and
// apply-correction. All 32 tests that predated this file exercised pure
// helpers only; none of them would have caught a script that printed OK and
// exited 1, or printed FAIL and exited 0. These spawn the real CLI.
//
// None of these depend on the network: a bad --recent or --slug value is
// validated (and, for --slug, checked against the local article list) before
// any fetch() call happens, so a script that reaches its FAIL line here
// never made a network request. apply-correction's real write path (the one
// case that touches data/articles.json) is only exercised for inputs that
// exit before ever calling writeFileSync, and each of those tests confirms
// the file is byte-identical before and after as a second guard.

const here = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(here, "..");
const ARTICLES = resolve(REPO, "data", "articles.json");

function run(scriptRelPath, args) {
  return spawnSync(process.execPath, [resolve(REPO, scriptRelPath), ...args], {
    cwd: REPO,
    encoding: "utf8",
  });
}

test("check:same-date exits 0 even when it reports doubles (the advisory contract)", () => {
  const dir = mkdtempSync(join(tmpdir(), "vr-org-same-date-"));
  const fixture = join(dir, "articles.json");
  try {
    writeFileSync(
      fixture,
      JSON.stringify([
        { slug: "a", author: "Alex Reeves", publishDate: "2026-08-28" },
        { slug: "b", author: "Alex Reeves", publishDate: "2026-08-28" },
      ]),
      "utf8"
    );
    const result = run("scripts/check-same-date-byline.mjs", [`--file=${fixture}`]);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /check:same-date {2}NOTE/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check:same-date exits 1 on a bad --recent value instead of silently scanning everything", () => {
  const result = run("scripts/check-same-date-byline.mjs", ["--recent=notanumber"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:same-date {2}FAIL/);
});

test("check:same-date exits 1 when --recent is the trailing argument with no value", () => {
  const result = run("scripts/check-same-date-byline.mjs", ["--recent"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:same-date {2}FAIL/);
});

test("check:same-date exits 1 when --file is given with no path", () => {
  const result = run("scripts/check-same-date-byline.mjs", ["--file"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:same-date {2}FAIL/);
});

test("check:youtube exits 1 on an unmatched --slug, without opening the network", () => {
  const result = run("scripts/check-youtube-ids.mjs", ["--slug=this-slug-does-not-exist-xyz"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:youtube {2}FAIL/);
});

test("check:youtube exits 1 on a bad --recent value", () => {
  const result = run("scripts/check-youtube-ids.mjs", ["--recent=12notanumber"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:youtube {2}FAIL/);
});

test("check:youtube exits 1 when --recent is the trailing argument with no value", () => {
  const result = run("scripts/check-youtube-ids.mjs", ["--recent"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:youtube {2}FAIL/);
});

test("check:steam exits 1 on an unmatched --slug, without opening the network", () => {
  const result = run("scripts/check-steam-products.mjs", ["--slug=this-slug-does-not-exist-xyz"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:steam {2}FAIL/);
});

test("check:steam exits 1 on a bad --recent value", () => {
  const result = run("scripts/check-steam-products.mjs", ["--recent"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:steam {2}FAIL/);
});

// --file lets the travel-mode verification gate point check:youtube and
// check:steam at a draft articles file that has not been added to
// data/articles.json yet, since verification has to run before publishing.
// These three cases per script mirror the --file coverage already proven for
// check:same-date in same-date-byline.test.mjs: a valid fixture resolves and
// runs the real gate, a missing value fails closed, and a path that cannot
// be read fails closed rather than silently falling back to the default
// archive (the fails-open shape a prior review already found in --recent).

test("check:youtube --file resolves a valid fixture and runs the real gate", () => {
  const dir = mkdtempSync(join(tmpdir(), "vr-org-youtube-file-"));
  const fixture = join(dir, "draft-articles.json");
  try {
    writeFileSync(fixture, JSON.stringify([{ slug: "no-video-here", body: "<p>no video here</p>" }]), "utf8");
    const result = run("scripts/check-youtube-ids.mjs", [`--file=${fixture}`]);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /check:youtube {2}OK {2}0 video/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check:youtube exits 1 when --file is given with no value", () => {
  const result = run("scripts/check-youtube-ids.mjs", ["--file"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:youtube {2}FAIL/);
});

test("check:youtube exits 1 when --file points at a nonexistent path, without falling back to the default archive", () => {
  const dir = mkdtempSync(join(tmpdir(), "vr-org-youtube-file-missing-"));
  const missing = join(dir, "does-not-exist.json");
  try {
    const result = run("scripts/check-youtube-ids.mjs", [`--file=${missing}`]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /check:youtube {2}FAIL/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// Deliberately no Steam link of any kind (app, bundle or sub) in this
// fixture, matching the network-free invariant this whole file states up
// top: extractSteamLinks finds nothing, so main() never calls resolveRef(),
// and the test still proves --file was actually resolved and read (the
// run() would exit 1 on a missing/unreadable path, per the tests below)
// without depending on a live network call. The real-network cases,
// including a fixture with an actual /bundle/ link resolving through
// ajaxresolvebundles (the endpoint this gate silently skipped before this
// fix, which is how a rehearsal article's headline price went unchecked),
// are exercised by hand as part of manual verification, not pinned into the
// automated suite.
test("check:steam --file resolves a valid fixture and runs the real gate", () => {
  const dir = mkdtempSync(join(tmpdir(), "vr-org-steam-file-"));
  const fixture = join(dir, "draft-articles.json");
  try {
    writeFileSync(fixture, JSON.stringify([{ slug: "no-links-here", body: "<p>no steam links here</p>" }]), "utf8");
    const result = run("scripts/check-steam-products.mjs", [`--file=${fixture}`]);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /check:steam {2}OK {2}0 steam link/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check:steam exits 1 when --file is given with no value", () => {
  const result = run("scripts/check-steam-products.mjs", ["--file"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /check:steam {2}FAIL/);
});

test("check:steam exits 1 when --file points at a nonexistent path, without falling back to the default archive", () => {
  const dir = mkdtempSync(join(tmpdir(), "vr-org-steam-file-missing-"));
  const missing = join(dir, "does-not-exist.json");
  try {
    const result = run("scripts/check-steam-products.mjs", [`--file=${missing}`]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /check:steam {2}FAIL/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("apply-correction exits 1 on a malformed --date and never writes data/articles.json", () => {
  const before = readFileSync(ARTICLES);
  const result = run("scripts/apply-correction.mjs", [
    "--slug=this-slug-does-not-exist-xyz",
    "--text=irrelevant",
    "--date=08/29/2026",
  ]);
  const after = readFileSync(ARTICLES);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /apply-correction {2}FAIL/);
  assert.deepEqual(before, after);
});

test("apply-correction exits 1 for an unmatched slug and never writes data/articles.json", () => {
  const before = readFileSync(ARTICLES);
  const result = run("scripts/apply-correction.mjs", [
    "--slug=this-slug-does-not-exist-xyz",
    "--text=irrelevant",
    "--date=2026-08-29",
  ]);
  const after = readFileSync(ARTICLES);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /apply-correction {2}FAIL/);
  assert.deepEqual(before, after);
});

test("apply-correction exits 1 with no arguments and never writes data/articles.json", () => {
  const before = readFileSync(ARTICLES);
  const result = run("scripts/apply-correction.mjs", []);
  const after = readFileSync(ARTICLES);
  assert.equal(result.status, 1);
  assert.deepEqual(before, after);
});
