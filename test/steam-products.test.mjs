import { test } from "node:test";
import assert from "node:assert/strict";
import { extractSteamLinks, namesAgree } from "../scripts/check-steam-products.mjs";

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
  assert.equal(namesAgree("Beat Saber", "Beat Saber"), true);
  assert.equal(namesAgree("POSTAL 2", "POSTAL 2"), true);
});

test("namesAgree accepts a VR suffix on the real product name", () => {
  assert.equal(namesAgree("Walkabout Mini Golf", "Walkabout Mini Golf VR"), true);
});

test("namesAgree rejects a Redux edition standing in for the original", () => {
  assert.equal(namesAgree("POSTAL 2", "POSTAL 2 Redux"), false);
});

test("namesAgree rejects an unrelated product", () => {
  assert.equal(namesAgree("Beat Saber", "Half-Life: Alyx"), false);
});
