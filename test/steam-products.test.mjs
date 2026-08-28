import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractSteamLinks,
  namesAgree,
  uniqueAppIds,
  parseRecentFlag,
  parseSlugFlag,
} from "../scripts/check-steam-products.mjs";

test("extracts appid and anchor text", () => {
  const body = '<a href="https://store.steampowered.com/app/620980/" target="_blank" rel="noopener">Beat Saber</a>';
  const links = extractSteamLinks(body);
  assert.equal(links.length, 1);
  assert.equal(links[0].appid, "620980");
  assert.equal(links[0].anchor, "Beat Saber");
});

test("extracts an appid from a url carrying a name slug", () => {
  const body = '<a href="https://store.steampowered.com/app/12120/Grand_Theft_Auto_San_Andreas/">GTA San Andreas</a>';
  assert.equal(extractSteamLinks(body)[0].appid, "12120");
});

test("strips nested markup out of the anchor text", () => {
  const body = '<a href="https://store.steampowered.com/app/1408230/"><em>Walkabout</em> Mini Golf</a>';
  assert.equal(extractSteamLinks(body)[0].anchor, "Walkabout Mini Golf");
});

test("returns nothing when there are no steam links", () => {
  assert.deepEqual(extractSteamLinks("<p>no links</p>"), []);
});

test("namesAgree accepts an exact match ignoring case and punctuation", () => {
  // Genuinely different strings that must still normalize equal, not the
  // same string compared against itself (that would also pass a naive
  // anchor === appName with no normalization at all).
  assert.equal(namesAgree("Beat Saber", "beat saber!"), true);
  assert.equal(namesAgree("POSTAL 2", "postal 2"), true);
});

test("namesAgree does not auto-accept a VR suffix, even the legitimate case", () => {
  // "Walkabout Mini Golf" linking to "Walkabout Mini Golf VR" is a correct,
  // legitimate link. It is still surfaced as REVIEW rather than auto-accepted,
  // because the identical shape also describes a wrong-product link (see the
  // next test). There is no string-level way to tell the two apart, so both
  // are deliberately left for a human or agent to judge.
  assert.equal(namesAgree("Walkabout Mini Golf", "Walkabout Mini Golf VR"), false);
});

test("namesAgree rejects a different studio's VR edition of a same-named flat game", () => {
  // The flagship collision from CLAUDE.md: "I Am Your Beast" (Strange
  // Scaffold, flat) is not "I AM YOUR BEAST VR" (Impact Inked). Same shape as
  // the Walkabout case above, opposite ground truth, which is exactly why
  // neither can be resolved by string matching alone.
  assert.equal(namesAgree("I Am Your Beast", "I AM YOUR BEAST VR"), false);
});

test("namesAgree rejects a Redux edition standing in for the original", () => {
  assert.equal(namesAgree("POSTAL 2", "POSTAL 2 Redux"), false);
});

test("namesAgree rejects an unrelated product", () => {
  assert.equal(namesAgree("Beat Saber", "Half-Life: Alyx"), false);
});

test("namesAgree never auto-accepts an empty or punctuation-only anchor", () => {
  assert.equal(namesAgree("", "VR"), false);
  assert.equal(namesAgree("!!!", "VR"), false);
});

test("uniqueAppIds dedupes repeated app ids across occurrences, in first-seen order", () => {
  const occurrences = [
    { slug: "a", appid: "620980", anchor: "Beat Saber" },
    { slug: "b", appid: "620980", anchor: "Beat Saber" },
    { slug: "c", appid: "1408230", anchor: "Walkabout Mini Golf" },
  ];
  assert.deepEqual(uniqueAppIds(occurrences), ["620980", "1408230"]);
});

test("uniqueAppIds returns an empty list for no occurrences", () => {
  assert.deepEqual(uniqueAppIds([]), []);
});

test("parseRecentFlag accepts the space form", () => {
  const flag = parseRecentFlag(["--recent", "12"]);
  assert.deepEqual(flag, { present: true, valid: true, value: 12, raw: "12" });
});

test("parseRecentFlag accepts the equals form", () => {
  const flag = parseRecentFlag(["--recent=12"]);
  assert.equal(flag.valid, true);
  assert.equal(flag.value, 12);
});

test("parseRecentFlag is invalid when --recent is the trailing argument with no value", () => {
  const flag = parseRecentFlag(["--recent"]);
  assert.equal(flag.present, true);
  assert.equal(flag.valid, false);
});

test("parseRecentFlag is invalid for a non-numeric value in either form", () => {
  assert.equal(parseRecentFlag(["--recent=abc"]).valid, false);
  assert.equal(parseRecentFlag(["--recent", "abc"]).valid, false);
});

test("parseRecentFlag defaults to the whole archive when absent", () => {
  assert.deepEqual(parseRecentFlag([]), { present: false, valid: true, value: 0, raw: null });
});

test("parseSlugFlag accepts both the equals and space forms", () => {
  assert.equal(parseSlugFlag(["--slug=foo"]).value, "foo");
  assert.equal(parseSlugFlag(["--slug", "foo"]).value, "foo");
});

test("parseSlugFlag is invalid when given with no value", () => {
  assert.equal(parseSlugFlag(["--slug"]).valid, false);
});
