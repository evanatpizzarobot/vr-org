#!/usr/bin/env node
/**
 * Em dash / en dash gate.
 *
 * No em dashes anywhere is the oldest and most emphatic rule this site has, and
 * until now the only thing enforcing it was apply-correction.mjs, which sees one
 * sentence of correction text and nothing else. Everything else ran on care.
 *
 * Care is not enough when text arrives from somewhere other than a writer. On
 * 2026-09-11 the Playable tier table on /great-on-frame was generated from
 * Valve's own product names, and two of them, Pathfinder: Kingmaker and
 * Nikoderiko, carry em dashes in their Steam titles. They went into a page
 * source in a shape no writer would have typed. Anything pulled from a store
 * API, a feed, or a press release can do the same.
 *
 * What it flags:
 *
 *   EM DASH   U+2014, anywhere in article text or page source.
 *   EN DASH   U+2013, same. The house style is a comma, a colon or a rewrite.
 *   DOUBLE    "--" used as punctuation in article prose only.
 *
 * Double hyphens are checked in article prose and nowhere else, deliberately.
 * Source files are full of legitimate ones: CSS custom properties (--bg-2),
 * CLI flags in doc comments (npm run correction -- --slug=...), and long option
 * names in scripts. Flagging those would train everyone to ignore this gate.
 * Inside articles, <code> spans are skipped for the same reason, since a CLI
 * flag can legitimately appear in a technical piece.
 *
 * A product name is not an exemption. Rewrite it with a hyphen or a colon the
 * way Steam itself does elsewhere. The reader loses nothing and the rule holds.
 *
 * Exit 1 if any finding, else exit 0.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const EM = "—";
const EN = "–";

/** Files to walk: page and component sources, plus the tracked data files. */
const SRC_DIR = join(root, "src");
const DATA_DIR = join(root, "data");

function walk(dir, exts, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walk(full, exts, out);
    } else if (exts.some((e) => name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

/** Line number of a character offset, 1-indexed. */
function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

/** A short window around the offending character, for the report. */
function context(text, index, width = 60) {
  const start = Math.max(0, index - width);
  const end = Math.min(text.length, index + width);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

const findings = [];

function scanText(label, text, { doubleHyphen }) {
  for (const [char, name] of [
    [EM, "em dash"],
    [EN, "en dash"],
  ]) {
    let i = text.indexOf(char);
    while (i >= 0) {
      findings.push({ label, line: lineOf(text, i), kind: name, ctx: context(text, i) });
      i = text.indexOf(char, i + 1);
    }
  }
  if (!doubleHyphen) return;
  // Strip code spans before looking for "--": a CLI flag inside <code> is fine.
  const stripped = text.replace(/<code>[\s\S]*?<\/code>/g, (m) => " ".repeat(m.length));
  const re = /--/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    findings.push({
      label,
      line: lineOf(text, m.index),
      kind: "double hyphen",
      ctx: context(text, m.index),
    });
  }
}

// Article text: title, snippet and body, which is where the rule matters most.
const articlesPath = join(DATA_DIR, "articles.json");
let articles = [];
try {
  articles = JSON.parse(readFileSync(articlesPath, "utf8"));
} catch (err) {
  console.log(`check:dashes  FAIL  could not read articles.json: ${err.message}`);
  process.exit(1);
}
for (const a of articles) {
  for (const field of ["title", "snippet", "body"]) {
    if (typeof a[field] !== "string") continue;
    // Tags and their attributes are stripped first. A Wikimedia filename can
    // legitimately contain "---" (Tokyo-Game-Show-2024-Day4---2024-09-29), and
    // an image URL is not prose the rule is about.
    const prose = a[field].replace(/<[^>]+>/g, " ");
    scanText(`article ${a.slug} (${field})`, prose, { doubleHyphen: true });
  }
}

// Page and component sources, em and en dashes only.
for (const file of walk(SRC_DIR, [".tsx", ".ts", ".css"])) {
  const rel = relative(root, file).replace(/\\/g, "/");
  scanText(rel, readFileSync(file, "utf8"), { doubleHyphen: false });
}

// Other tracked data files (events, top lists, release dates and friends).
//
// feed-cache.json and featured.json are skipped. Both are runtime state written
// by the RSS engine out of other outlets' headlines, neither is tracked in git,
// and neither is prose this site wrote. Failing a build because UploadVR used an
// en dash would be the gate misfiring, not a finding.
const RUNTIME_STATE = new Set(["feed-cache.json", "featured.json", "posted-tweets.json"]);
for (const file of walk(DATA_DIR, [".json"])) {
  if (file === articlesPath) continue;
  const rel = relative(root, file).replace(/\\/g, "/");
  if (RUNTIME_STATE.has(rel.split("/").pop())) continue;
  scanText(rel, readFileSync(file, "utf8"), { doubleHyphen: false });
}

if (findings.length === 0) {
  console.log("check:dashes  OK  no em dashes, en dashes or stray double hyphens");
  process.exit(0);
}

for (const f of findings) {
  console.log(`check:dashes  ${f.kind.toUpperCase()}  ${f.label}:${f.line}`);
  console.log(`              ${f.ctx}`);
}
console.log(
  `\ncheck:dashes  FAIL  ${findings.length} finding(s). Use a comma, a colon, a hyphen, or rewrite.`,
);
process.exit(1);
