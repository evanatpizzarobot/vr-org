import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toText,
  selfCorrectionClaim,
  internalArticleLinks,
  hasCorrection,
  findUnpairedCorrections,
  parseRecentFlag,
} from "../scripts/check-corrections.mjs";

// This gate blocks an unattended run, so most of these prove it does NOT fire
// on ordinary prose. Attributing an error to somebody else is the single most
// common shape in hardware and platform coverage ("Meta's earlier figure was
// wrong"), and reading that as a VR.org correction would fail a clean build.

test("fires on the 2026-09-02 shape: our own reporting, named and walked back", () => {
  const text =
    'On August 28, VR.org reported that Beyond 2 "now starts at $899," that entry had ' +
    "come down $120 in four months, and that the $1,019 on Bigscreen's marketing pages " +
    "was an older figure the store listing had already replaced. That was wrong.";
  assert.ok(selfCorrectionClaim(text));
});

test("does not fire when the error belongs to somebody else", () => {
  const text = "UploadVR reported the October date. Meta's own earlier guidance was wrong.";
  assert.equal(selfCorrectionClaim(text), null);
});

test("does not fire on a self-reference with no reporting verb attached", () => {
  const text = "VR.org is a VR and AR news site. The fit was wrong for his face.";
  assert.equal(selfCorrectionClaim(text), null);
});

test("does not fire when we merely say what we covered", () => {
  const text = "Valve has since revised the requirement. This site covered the original figure in March.";
  assert.equal(selfCorrectionClaim(text), null);
});

test("does not pair a self-reference with an admission four paragraphs later", () => {
  const text =
    "This site reported the launch window in April. " +
    "x".repeat(600) +
    " The spec sheet was wrong.";
  assert.equal(selfCorrectionClaim(text), null);
});

test("toText drops figures so an image credit cannot carry a claim", () => {
  const body =
    "<p>The price moved.</p>" +
    '<figure><img src="https://cdn.example.com/a.png" alt="a" /><figcaption>Image: Bigscreen</figcaption></figure>';
  const text = toText(body);
  assert.match(text, /The price moved/);
  assert.doesNotMatch(text, /Bigscreen/);
});

test("internalArticleLinks returns each linked slug once, in order", () => {
  const body =
    '<p>See <a href="/articles/alpha">alpha</a> and <a href="/articles/beta">beta</a>, ' +
    'plus <a href="/articles/alpha">alpha again</a> and <a href="https://uploadvr.com/x">an outlet</a>.</p>';
  assert.deepEqual(internalArticleLinks(body), ["alpha", "beta"]);
});

test("hasCorrection recognises the house block apply-correction writes", () => {
  assert.ok(hasCorrection({ body: "<p>x</p><blockquote><strong>Correction, September 2, 2026:</strong> y</blockquote>" }));
  assert.equal(hasCorrection({ body: "<p>A correction was issued by Valve.</p>" }), false);
});

test("UNPAIRED CORRECTION fires when the corrected article carries no correction", () => {
  const all = [
    {
      slug: "follow-up",
      publishDate: "2026-09-02",
      body:
        '<p>On August 28, <a href="/articles/original">VR.org reported</a> that it starts at $899. That was wrong.</p>',
    },
    { slug: "original", publishDate: "2026-08-28", body: "<p>It starts at $899.</p>" },
  ];
  const findings = findUnpairedCorrections(all, all);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "UNPAIRED CORRECTION");
  assert.equal(findings[0].art.slug, "follow-up");
});

test("UNPAIRED CORRECTION clears once the correction lands on the article that erred", () => {
  const all = [
    {
      slug: "follow-up",
      publishDate: "2026-09-02",
      body:
        '<p>On August 28, <a href="/articles/original">VR.org reported</a> that it starts at $899. That was wrong.</p>',
    },
    {
      slug: "original",
      publishDate: "2026-08-28",
      updatedDate: "2026-09-02",
      body: "<p>It starts at $899.</p><blockquote><strong>Correction, September 2, 2026:</strong> $1,019.</blockquote>",
    },
  ];
  assert.deepEqual(findUnpairedCorrections(all, all), []);
});

test("a follow-up that links nothing internal fails with the no-link detail", () => {
  const all = [
    { slug: "follow-up", publishDate: "2026-09-02", body: "<p>VR.org reported $899. That was wrong.</p>" },
  ];
  const findings = findUnpairedCorrections(all, all);
  assert.equal(findings.length, 1);
  assert.match(findings[0].detail, /links no VR\.org article/);
});

test("the corrected article is found outside a narrowed --recent window", () => {
  const followUp = {
    slug: "follow-up",
    publishDate: "2026-09-02",
    body: '<p>On August 28, <a href="/articles/original">VR.org reported</a> $899. That was wrong.</p>',
  };
  const original = {
    slug: "original",
    publishDate: "2026-08-28",
    updatedDate: "2026-09-02",
    body: "<p>x</p><blockquote><strong>Correction, September 2, 2026:</strong> y</blockquote>",
  };
  const filler = Array.from({ length: 20 }, (_, i) => ({ slug: `f${i}`, publishDate: "2026-08-30", body: "<p>x</p>" }));
  const all = [followUp, ...filler, original];
  // Scope is the newest article only; the target sits 21 entries down.
  assert.deepEqual(findUnpairedCorrections([followUp], all), []);
});

test("CORRECTION NO DATE fires on a correction block with updatedDate unset", () => {
  const all = [
    {
      slug: "hand-edited",
      publishDate: "2026-08-28",
      updatedDate: null,
      body: "<p>x</p><blockquote><strong>Correction, September 2, 2026:</strong> y</blockquote>",
    },
  ];
  const findings = findUnpairedCorrections(all, all);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "CORRECTION NO DATE");
});

test("an article that both admits the error and carries the correction is complete", () => {
  const all = [
    {
      slug: "self-contained",
      publishDate: "2026-09-02",
      updatedDate: "2026-09-02",
      body:
        "<p>This site said 90 fps. That was wrong.</p>" +
        "<blockquote><strong>Correction, September 2, 2026:</strong> 72 fps.</blockquote>",
    },
  ];
  assert.deepEqual(findUnpairedCorrections(all, all), []);
});

test("parseRecentFlag refuses a value that is not a positive whole number", () => {
  assert.equal(parseRecentFlag([]), 0);
  assert.equal(parseRecentFlag(["--recent", "5"]), 5);
  assert.equal(parseRecentFlag(["--recent=5"]), 5);
  assert.throws(() => parseRecentFlag(["--recent=0"]), /positive whole number/);
  assert.throws(() => parseRecentFlag(["--recent=notanumber"]), /positive whole number/);
});
