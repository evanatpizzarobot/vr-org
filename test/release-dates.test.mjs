import { test } from "node:test";
import assert from "node:assert/strict";
import {
  dateKey,
  sortReleaseItems,
  findPassedDateItems,
  itemNameTokens,
  articleMatchesItem,
  findTrackerDrift,
} from "../scripts/check-release-dates.mjs";

test("dateKey prefers isoDate over sortDate", () => {
  assert.equal(dateKey({ isoDate: "2026-09-10", sortDate: "2026-09-03" }), "2026-09-10");
  assert.equal(dateKey({ isoDate: null, sortDate: "2026-09-03" }), "2026-09-03");
  assert.equal(dateKey({ isoDate: null, sortDate: null }), null);
});

test("sortReleaseItems puts released last and undated windows after dated ones", () => {
  const items = [
    { name: "Released", status: "released", isoDate: "2026-09-04", sortDate: null },
    { name: "Undated", status: "expected", isoDate: null, sortDate: null },
    { name: "Dated", status: "confirmed", isoDate: "2026-09-10", sortDate: null },
  ];
  assert.deepEqual(
    sortReleaseItems(items).map((i) => i.name),
    ["Dated", "Undated", "Released"]
  );
});

test("findPassedDateItems flags only dates strictly before today", () => {
  const upcoming = [
    { name: "Yesterday", isoDate: "2026-09-07", sortDate: null },
    { name: "Today", isoDate: "2026-09-08", sortDate: null },
    { name: "Tomorrow", isoDate: "2026-09-09", sortDate: null },
    { name: "Undated", isoDate: null, sortDate: null },
  ];
  assert.deepEqual(
    findPassedDateItems(upcoming, "2026-09-08").map((i) => i.name),
    ["Yesterday"]
  );
});

test("itemNameTokens drops generic product words and dedupes", () => {
  assert.deepEqual(itemNameTokens("RayNeo iO Smart Glasses"), ["rayneo", "io"]);
  assert.deepEqual(itemNameTokens("RayNeo GT and GT Max"), ["rayneo", "gt", "max"]);
  assert.deepEqual(itemNameTokens("Transformers: Beyond Reality Redux"), [
    "transformers",
    "beyond",
    "reality",
    "redux",
  ]);
});

test("articleMatchesItem matches whole slug segments, not substrings", () => {
  const tokens = ["rayneo", "io"];
  assert.equal(
    articleMatchesItem({ slug: "rayneo-io-gt-max-two-devices-september-4-2026" }, tokens),
    true
  );
  // "io" must not match inside "audio" or "studio".
  assert.equal(articleMatchesItem({ slug: "rayneo-audio-studio-review" }, tokens), false);
});

test("articleMatchesItem refuses to match on a single token", () => {
  assert.equal(articleMatchesItem({ slug: "pico-anything-at-all" }, ["pico"]), false);
});

test("findTrackerDrift catches the Pico case: a newer article than lastVerified", () => {
  const items = [
    {
      id: "pico-project-swan",
      name: "Pico Space Pro",
      link: "/articles/pico-space-pro-september-2-beijing-debut-2026",
      lastVerified: "2026-08-24",
    },
  ];
  const articles = [
    { slug: "pico-space-pro-september-2-beijing-debut-2026", publishDate: "2026-08-20" },
    {
      slug: "pico-space-pro-delayed-q4-september-event-cancelled-2026",
      publishDate: "2026-08-26",
    },
  ];
  const drift = findTrackerDrift(items, articles);
  assert.equal(drift.length, 1);
  assert.equal(drift[0].newest.slug, "pico-space-pro-delayed-q4-september-event-cancelled-2026");
  assert.equal(drift[0].reasons.length, 2);
  assert.match(drift[0].reasons[0], /newer than lastVerified 2026-08-24/);
  assert.match(drift[0].reasons[1], /link points at/);
});

test("findTrackerDrift stays quiet when the entry is current", () => {
  const items = [
    {
      id: "pico-project-swan",
      name: "Pico Space Pro",
      link: "/articles/pico-space-pro-delayed-q4-september-event-cancelled-2026",
      lastVerified: "2026-09-08",
    },
  ];
  const articles = [
    {
      slug: "pico-space-pro-delayed-q4-september-event-cancelled-2026",
      publishDate: "2026-08-26",
    },
  ];
  assert.deepEqual(findTrackerDrift(items, articles), []);
});

test("findTrackerDrift ignores items with no matching article", () => {
  const items = [
    { id: "x", name: "Transformers Beyond Reality Redux", link: null, lastVerified: "2026-08-01" },
  ];
  const articles = [{ slug: "some-unrelated-piece-2026", publishDate: "2026-09-01" }];
  assert.deepEqual(findTrackerDrift(items, articles), []);
});
