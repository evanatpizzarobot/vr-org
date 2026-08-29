import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractSteamLinks,
  namesAgree,
  uniqueSteamRefs,
  parseRecentFlag,
  parseSlugFlag,
} from "../scripts/check-steam-products.mjs";

test("extracts an app link's kind, id and anchor text", () => {
  const body = '<a href="https://store.steampowered.com/app/620980/" target="_blank" rel="noopener">Beat Saber</a>';
  const links = extractSteamLinks(body);
  assert.equal(links.length, 1);
  assert.equal(links[0].kind, "app");
  assert.equal(links[0].id, "620980");
  assert.equal(links[0].anchor, "Beat Saber");
});

test("extracts an id from a url carrying a name slug", () => {
  const body = '<a href="https://store.steampowered.com/app/12120/Grand_Theft_Auto_San_Andreas/">GTA San Andreas</a>';
  assert.equal(extractSteamLinks(body)[0].id, "12120");
});

test("strips nested markup out of the anchor text", () => {
  const body = '<a href="https://store.steampowered.com/app/1408230/"><em>Walkabout</em> Mini Golf</a>';
  assert.equal(extractSteamLinks(body)[0].anchor, "Walkabout Mini Golf");
});

test("returns nothing when there are no steam links", () => {
  assert.deepEqual(extractSteamLinks("<p>no links</p>"), []);
});

// The defect this fix closes: a rehearsal article's headline price came from
// a /bundle/ link, and the gate reported OK without ever opening it because
// extractSteamLinks only matched /app/. These pin all three forms, together
// in one body so an app link cannot mask a bundle link being dropped.
test("extracts all three link forms, app, bundle and sub, from one body", () => {
  const body = [
    '<a href="https://store.steampowered.com/app/620980/">Beat Saber</a>',
    '<a href="https://store.steampowered.com/bundle/79241/Some_Bundle/">Hip Hop Mixtape 2</a>',
    '<a href="https://store.steampowered.com/sub/7/">Condition Zero pack</a>',
  ].join(" ");
  const links = extractSteamLinks(body);
  assert.equal(links.length, 3);
  assert.deepEqual(
    links.map((l) => l.kind),
    ["app", "bundle", "sub"]
  );
  assert.deepEqual(
    links.map((l) => l.id),
    ["620980", "79241", "7"]
  );
});

test("a bundle link is no longer silently dropped in a body that also has an app link", () => {
  const body =
    '<a href="https://store.steampowered.com/bundle/79241/">Hip Hop Mixtape 2</a> ' +
    '<a href="https://store.steampowered.com/app/620980/">Beat Saber</a>';
  const links = extractSteamLinks(body);
  assert.equal(links.length, 2);
  assert.ok(links.some((l) => l.kind === "bundle" && l.id === "79241"));
  assert.ok(links.some((l) => l.kind === "app" && l.id === "620980"));
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

test("uniqueSteamRefs dedupes repeated (kind, id) pairs across occurrences, in first-seen order", () => {
  const occurrences = [
    { slug: "a", kind: "app", id: "620980", anchor: "Beat Saber" },
    { slug: "b", kind: "app", id: "620980", anchor: "Beat Saber" },
    { slug: "c", kind: "app", id: "1408230", anchor: "Walkabout Mini Golf" },
  ];
  assert.deepEqual(uniqueSteamRefs(occurrences), [
    { kind: "app", id: "620980" },
    { kind: "app", id: "1408230" },
  ]);
});

test("uniqueSteamRefs returns an empty list for no occurrences", () => {
  assert.deepEqual(uniqueSteamRefs([]), []);
});

test("uniqueSteamRefs does not merge an app id and a bundle id that share the same number", () => {
  // A bundle id and an app id are drawn from separate Steam numbering spaces
  // and can collide numerically. Deduping on id alone would treat these as
  // the same reference and resolve one of them against the wrong endpoint.
  const occurrences = [
    { slug: "a", kind: "app", id: "79241", anchor: "Some App" },
    { slug: "b", kind: "bundle", id: "79241", anchor: "Hip Hop Mixtape 2" },
  ];
  const refs = uniqueSteamRefs(occurrences);
  assert.equal(refs.length, 2);
  assert.deepEqual(refs, [
    { kind: "app", id: "79241" },
    { kind: "bundle", id: "79241" },
  ]);
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
