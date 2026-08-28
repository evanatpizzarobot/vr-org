#!/usr/bin/env node
/**
 * Travel mode preflight.
 *
 * Run before drafting anything in an unattended session. It answers one
 * question: is this repository in a state I understand well enough to safely
 * add articles to it?
 *
 * Three ways the answer is no:
 *   1. Uncommitted changes in the working tree. Something else is mid-edit.
 *   2. Local master is behind origin. Drafting would build on a stale archive
 *      and the duplicate check would miss recently published pieces.
 *   3. Unpushed local commits. Another tool committed without pushing, which
 *      has happened five times between 2026-06-09 and 2026-08-10, and on
 *      2026-06-25 produced a near duplicate caught only by this check.
 *
 * Exit 0 means safe to draft. Exit 1 means stop and notify Evan.
 *
 * Usage:
 *   node scripts/travel-preflight.mjs
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(here, "..");

function git(args) {
  return execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trim();
}

function main() {
  const problems = [];

  try {
    git(["fetch", "origin", "master"]);
  } catch (err) {
    console.error(`travel:preflight  FAIL  could not fetch origin: ${err.message}`);
    // process.exitCode (not process.exit()) so Node drains the event loop
    // naturally. execFileSync is synchronous so process.exit() would be safe
    // here, but consistency with the other new scripts on this branch (which
    // hit a real Windows libuv crash from process.exit() with pending I/O)
    // is worth more than matching this one call site to the brief.
    process.exitCode = 1;
    return;
  }

  const dirty = git(["status", "--porcelain"]);
  if (dirty) {
    problems.push(`working tree is not clean:\n${dirty.split("\n").map((l) => `      ${l}`).join("\n")}`);
  }

  const unpushed = git(["log", "origin/master..master", "--oneline"]);
  if (unpushed) {
    problems.push(`unpushed local commits:\n${unpushed.split("\n").map((l) => `      ${l}`).join("\n")}`);
  }

  const unpulled = git(["log", "master..origin/master", "--oneline"]);
  if (unpulled) {
    problems.push(`local master is behind origin:\n${unpulled.split("\n").map((l) => `      ${l}`).join("\n")}`);
  }

  if (problems.length > 0) {
    console.error("travel:preflight  FAIL  repository is not in a known-good state:");
    console.error("");
    for (const p of problems) console.error(`  - ${p}`);
    console.error("");
    console.error("Do NOT draft. Notify Evan with this output and stop.");
    process.exitCode = 1;
    return;
  }

  const head = git(["rev-parse", "--short", "HEAD"]);
  console.log(`travel:preflight  OK  clean tree, synced with origin at ${head}`);
  process.exitCode = 0;
  return;
}

main();
