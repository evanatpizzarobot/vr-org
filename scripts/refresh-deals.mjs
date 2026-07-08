#!/usr/bin/env node
// Commit + push a /deals refresh SAFELY, staging only the deals data file.
// This exists so the autonomous weekly claude.ai routine (and a local run)
// can publish deals.json edits without ever running `git add -A`, which is
// what used to sweep in CRLF-normalized or unrelated files and break the
// Docker build. Run with: npm run deals:publish
//
// What it guarantees:
//   1. Validates data/deals.json parses as JSON with the expected shape.
//      A malformed file aborts BEFORE any git write, so a bad edit can never
//      ship a broken /deals page.
//   2. Commits with an explicit pathspec: `git commit -- data/deals.json`.
//      A pathspec commit records ONLY that file's current content, even if
//      other files happen to be staged or modified. Nothing else can ride
//      along. There is no `git add -A` anywhere in this script.
//   3. No-ops cleanly (exit 0) when deals.json has no changes, so a quiet
//      week does not create an empty commit or report a failure.
//   4. Pushes to origin/master; on a non-fast-forward it rebases the single
//      data commit onto the latest master once and retries.
//
// Flags / env:
//   --dry-run  (or DRY_RUN=1)   validate + report, make no commit or push
//   --no-push                    commit locally but do not push
//   --message "..."              override the commit message
//
// Exit codes: 0 = published or nothing to do; 1 = validation/git/push error.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

// Resolve the repo root from this script's own location (scripts/ is one level
// below root) so the tool works no matter which directory it is invoked from.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The ONLY paths this script is ever allowed to stage and commit. Keep this
// list tight. To also publish another data file (e.g. category-products.json),
// add it here; the same JSON validation and pathspec-commit safety apply.
const ALLOWLIST = ["data/deals.json"];

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run") || process.env.DRY_RUN === "1";
const NO_PUSH = argv.includes("--no-push");
const msgFlagIdx = argv.indexOf("--message");
const messageOverride =
  msgFlagIdx !== -1 ? argv[msgFlagIdx + 1] : process.env.DEALS_COMMIT_MSG;

function git(args, opts = {}) {
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf-8",
    stdio: opts.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
}

function fail(msg) {
  console.error(`refresh-deals: ${msg}`);
  process.exit(1);
}

// --- 1. Validate every allowlisted file that exists -------------------------
for (const rel of ALLOWLIST) {
  const abs = path.join(REPO_ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(abs, "utf-8"));
  } catch (err) {
    fail(`${rel} is not valid JSON: ${err.message}`);
  }
  // Shape check specific to the deals file.
  if (rel.endsWith("deals.json")) {
    if (!data || !Array.isArray(data.sections) || data.sections.length === 0) {
      fail(`${rel} must be an object with a non-empty "sections" array`);
    }
    const itemCount = data.sections.reduce(
      (n, s) => n + (Array.isArray(s.items) ? s.items.length : 0),
      0
    );
    if (itemCount === 0) fail(`${rel} has zero products across all sections`);
    console.log(
      `refresh-deals: ${rel} valid (${data.sections.length} sections, ${itemCount} products, lastUpdated ${data.lastUpdated ?? "unset"})`
    );
  }
}

// --- 2. Which allowlisted files actually changed vs HEAD ---------------------
const changed = ALLOWLIST.filter((rel) => {
  const status = git(["status", "--porcelain", "--", rel]).trim();
  return status.length > 0;
});

if (changed.length === 0) {
  console.log("refresh-deals: no changes to publish. Done.");
  process.exit(0);
}
console.log(`refresh-deals: changes detected in ${changed.join(", ")}`);

// --- 3. Commit (pathspec-scoped) --------------------------------------------
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
const message = messageOverride || `chore: refresh /deals (${today})`;

if (DRY_RUN) {
  console.log(`refresh-deals: [dry-run] would commit ${changed.join(", ")}`);
  console.log(`refresh-deals: [dry-run] message: ${message}`);
  console.log("refresh-deals: [dry-run] would push to origin/master");
  process.exit(0);
}

try {
  // Explicit pathspec: commits ONLY these files, ignoring anything else that
  // may be staged. This is the guardrail that replaces `git add -A`.
  git(["commit", "-m", message, "--", ...changed]);
  console.log(`refresh-deals: committed ${changed.join(", ")}`);
} catch (err) {
  fail(`commit failed: ${err.stderr || err.message}`);
}

if (NO_PUSH) {
  console.log("refresh-deals: --no-push set, leaving commit local. Done.");
  process.exit(0);
}

// --- 4. Push, with one rebase-and-retry on non-fast-forward ------------------
function tryPush() {
  try {
    git(["push", "origin", "HEAD:master"]);
    return true;
  } catch (err) {
    const out = `${err.stderr || ""}${err.stdout || ""}`;
    if (/non-fast-forward|fetch first|rejected/i.test(out)) return false;
    fail(`push failed: ${out || err.message}`);
  }
}

if (!tryPush()) {
  console.log("refresh-deals: push rejected (remote moved), rebasing once...");
  try {
    git(["fetch", "origin", "master"]);
    git(["rebase", "origin/master"]);
  } catch (err) {
    try {
      git(["rebase", "--abort"]);
    } catch {}
    fail(
      `rebase onto origin/master failed (likely a conflicting deals.json edit): ${err.stderr || err.message}`
    );
  }
  if (!tryPush()) fail("push still rejected after rebase; resolve manually");
}

console.log("refresh-deals: pushed to origin/master. /deals will refresh within ~5 min.");
