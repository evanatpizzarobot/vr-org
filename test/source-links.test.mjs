import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toText,
  externalHosts,
  extractQuotes,
  linksAnyOf,
  unlinkedOutlets,
  findUnlinkedSources,
  parseRecentFlag,
  parseFileFlag,
} from "../scripts/check-source-links.mjs";

// The gate blocks an unattended run, so the tests that matter most are the
// ones proving it does NOT fire on ordinary prose. A false positive costs a
// redraft; a false negative costs one unlinked citation.

test("extractQuotes pairs straight quotes in reading order, not by span", () => {
  // The 2026-08-24 XREAL shape: three short quotations with analysis between
  // them. A span regex pairs quote 2's closing mark with quote 3's opening
  // mark and returns the prose in between as a long quotation.
  const text =
    'XREAL called it an "exciting signal" of demand. The ship date is still ' +
    'listed as "Fall 2026," which is not a date at all, and the qualifier ' +
    'that showed up in the fine print is "base model" rather than a spec.';
  const quotes = extractQuotes(text);
  assert.deepEqual(quotes, ["exciting signal", "Fall 2026,", "base model"]);
});

test("extractQuotes handles directional curly quotes", () => {
  const text = "Meta says the panel “accepts any integer refresh rate from 72 Hz through 207 Hz” in its docs.";
  assert.deepEqual(extractQuotes(text), ["accepts any integer refresh rate from 72 Hz through 207 Hz"]);
});

test("extractQuotes drops an unclosed quote rather than swallowing the rest of the body", () => {
  const text = 'The spokesperson said "we are not commenting on unreleased hardware and never will be';
  assert.deepEqual(extractQuotes(text), []);
});

test("toText strips figures whole so image credits are not read as prose", () => {
  const body =
    "<p>The headset shipped Tuesday.</p>" +
    '<figure><img src="https://upload.wikimedia.org/x.jpg" alt="a" /><figcaption>Image: Wikimedia Commons</figcaption></figure>' +
    "<p>Pricing follows.</p>";
  const text = toText(body);
  assert.match(text, /The headset shipped Tuesday/);
  assert.match(text, /Pricing follows/);
  assert.doesNotMatch(text, /Wikimedia Commons/);
});

test("externalHosts ignores our own domain and anything inside a figure", () => {
  const body =
    '<p>See <a href="https://vr.org/articles/x">our earlier piece</a> and ' +
    '<a href="https://www.roadtovr.com/story/">the report</a>.</p>' +
    '<figure><a href="https://www.youtube.com/watch?v=abc"><img src="https://img.youtube.com/vi/abc/maxresdefault.jpg" /></a></figure>';
  assert.deepEqual([...externalHosts(body)], ["roadtovr.com"]);
});

test("linksAnyOf matches a subdomain of a cited outlet", () => {
  assert.equal(linksAnyOf(new Set(["asia.nikkei.com"]), ["nikkei.com"]), true);
  assert.equal(linksAnyOf(new Set(["nikkei.com.example.net"]), ["nikkei.com"]), false);
});

test("an outlet named with an attribution verb and no link is a finding", () => {
  const text = "Bloomberg reported on July 24 that the notice went out to partners.";
  const hits = unlinkedOutlets(text, new Set());
  assert.equal(hits.length, 1);
  assert.equal(hits[0].outlet, "Bloomberg");
});

test("the same outlet credited four times is one finding, not four", () => {
  const text =
    "Bloomberg reported the number. Bloomberg said the timeline slipped. " +
    "Bloomberg noted the supplier. Bloomberg confirmed the date.";
  assert.equal(unlinkedOutlets(text, new Set()).length, 1);
});

test("an outlet named WITHOUT an attribution verb is not a citation", () => {
  const text = "The trading desk runs on a Bloomberg terminal in the corner of the room.";
  assert.deepEqual(unlinkedOutlets(text, new Set()), []);
});

test("an outlet that IS linked produces no finding", () => {
  const text = "Bloomberg reported on July 24 that the notice went out.";
  assert.deepEqual(unlinkedOutlets(text, new Set(["bloomberg.com"])), []);
});

test("the 2026-08-31 defect: quoted docs plus a named outlet, zero external links", () => {
  const body =
    "<p>Meta's developer documentation now describes a headset that " +
    'can run past 120 Hz. The page states the display “accepts any integer refresh rate ' +
    'from 72 Hz through 207 Hz” and warns that “display scaling trades image quality for ' +
    'bandwidth in ways visible in fine detail”.</p>' +
    '<p>Road to VR reported on August 31 that the rates reached retail units.</p>' +
    '<p>We covered <a href="/articles/asus-rog-xreal-r1-240hz-ar-glasses">240Hz AR glasses</a> in May.</p>';

  const findings = findUnlinkedSources([{ slug: "quest-3", publishDate: "2026-08-31", body }]);
  const kinds = findings.map((f) => f.kind).sort();
  assert.deepEqual(kinds, ["UNLINKED OUTLET", "UNSOURCED QUOTES"]);
});

test("the same article passes once both sources are linked", () => {
  const body =
    '<p>Meta\'s <a href="https://developers.meta.com/horizon/documentation/native/android/mobile-display-refresh-rate/">developer documentation</a> ' +
    'states the display “accepts any integer refresh rate from 72 Hz through 207 Hz” and warns that ' +
    '“display scaling trades image quality for bandwidth in ways visible in fine detail”.</p>' +
    '<p><a href="https://roadtovr.com/quest-3-update-boost-refresh-rate-240hz/">Road to VR reported on August 31</a> that the rates reached retail units.</p>';

  assert.deepEqual(findUnlinkedSources([{ slug: "quest-3", publishDate: "2026-08-31", body }]), []);
});

test("one short quoted phrase is styling, not sourcing", () => {
  const body = '<p>Valve called the change a “minor adjustment” and moved on.</p>';
  assert.deepEqual(findUnlinkedSources([{ slug: "x", publishDate: "2026-08-01", body }]), []);
});

test("long quotes are fine when the article links a source somewhere", () => {
  const body =
    '<p>The studio’s post says “we are keeping the mobile version in lockstep with the VR platforms” ' +
    'and that “the roadmap for the next year is longer than anything we have attempted before”. ' +
    'Read it on <a href="https://store.steampowered.com/news/app/1096410">Steam</a>.</p>';
  assert.deepEqual(findUnlinkedSources([{ slug: "x", publishDate: "2026-08-01", body }]), []);
});

test("an image credit does not count as having sourced a quote", () => {
  const body =
    '<p>The filing says “the device operates in the 6 GHz band under part 15 rules” and that ' +
    '“the applicant requests confidentiality for the internal photographs”.</p>' +
    '<figure><img src="https://upload.wikimedia.org/a.jpg" /><figcaption>Image: Wikimedia Commons</figcaption></figure>';
  const findings = findUnlinkedSources([{ slug: "x", publishDate: "2026-08-01", body }]);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "UNSOURCED QUOTES");
});

test("parseRecentFlag accepts both spellings and rejects junk", () => {
  assert.equal(parseRecentFlag([]), 0);
  assert.equal(parseRecentFlag(["--recent", "5"]), 5);
  assert.equal(parseRecentFlag(["--recent=5"]), 5);
  assert.throws(() => parseRecentFlag(["--recent", "0"]), /positive whole number/);
  assert.throws(() => parseRecentFlag(["--recent", "notanumber"]), /positive whole number/);
  assert.throws(() => parseRecentFlag(["--recent", "2.5"]), /positive whole number/);
});

test("parseFileFlag falls back to the repo articles.json", () => {
  assert.match(parseFileFlag([]), /articles\.json$/);
  assert.match(parseFileFlag(["--file=/tmp/other.json"]), /other\.json$/);
});
