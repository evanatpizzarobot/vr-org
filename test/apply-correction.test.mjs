import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCorrectionBlock, applyCorrection } from "../scripts/apply-correction.mjs";

test("builds the house correction markup", () => {
  const block = buildCorrectionBlock("The price is $549, not $649.", "2026-08-29");
  assert.equal(
    block,
    '<blockquote><strong>Correction, August 29, 2026:</strong> The price is $549, not $649.</blockquote>'
  );
});

test("appends the correction to the end of the body", () => {
  const article = { slug: "x", body: "<p>original</p>", updatedDate: null };
  const out = applyCorrection(article, "Fixed a number.", "2026-08-29");
  assert.match(out.body, /^<p>original<\/p><blockquote>/);
  assert.match(out.body, /Fixed a number\.<\/blockquote>$/);
});

test("sets updatedDate to the correction date", () => {
  const article = { slug: "x", body: "<p>original</p>", updatedDate: null };
  assert.equal(applyCorrection(article, "note", "2026-08-29").updatedDate, "2026-08-29");
});

test("does not mutate the input article", () => {
  const article = { slug: "x", body: "<p>original</p>", updatedDate: null };
  applyCorrection(article, "note", "2026-08-29");
  assert.equal(article.body, "<p>original</p>");
  assert.equal(article.updatedDate, null);
});

test("rejects text containing an em dash", () => {
  const article = { slug: "x", body: "<p>original</p>", updatedDate: null };
  assert.throws(
    () => applyCorrection(article, `a \u2014 b`, "2026-08-29"),
    /em dash/i
  );
});

test("rejects text containing a double hyphen", () => {
  const article = { slug: "x", body: "<p>original</p>", updatedDate: null };
  assert.throws(() => applyCorrection(article, "a -- b", "2026-08-29"), /double hyphen/i);
});

test("appends a second correction after an existing one", () => {
  const article = { slug: "x", body: "<p>o</p><blockquote><strong>Correction, August 5, 2026:</strong> first</blockquote>", updatedDate: "2026-08-05" };
  const out = applyCorrection(article, "second", "2026-08-29");
  assert.match(out.body, /first<\/blockquote><blockquote>/);
  assert.equal(out.updatedDate, "2026-08-29");
});
