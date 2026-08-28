import { test } from "node:test";
import assert from "node:assert/strict";
import { findSameDateBylineCollisions } from "../scripts/check-same-date-byline.mjs";

test("flags two articles by the same author on the same date", () => {
  const articles = [
    { slug: "a", author: "Alex Reeves", publishDate: "2026-08-28" },
    { slug: "b", author: "Alex Reeves", publishDate: "2026-08-28" },
  ];
  const hits = findSameDateBylineCollisions(articles);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].author, "Alex Reeves");
  assert.equal(hits[0].date, "2026-08-28");
  assert.deepEqual(hits[0].slugs, ["a", "b"]);
});

test("allows different authors on the same date", () => {
  const articles = [
    { slug: "a", author: "Alex Reeves", publishDate: "2026-08-28" },
    { slug: "b", author: "Nina Castillo", publishDate: "2026-08-28" },
    { slug: "c", author: "Sam Whitfield", publishDate: "2026-08-28" },
  ];
  assert.deepEqual(findSameDateBylineCollisions(articles), []);
});

test("allows the same author on different dates", () => {
  const articles = [
    { slug: "a", author: "Alex Reeves", publishDate: "2026-08-28" },
    { slug: "b", author: "Alex Reeves", publishDate: "2026-08-27" },
  ];
  assert.deepEqual(findSameDateBylineCollisions(articles), []);
});

test("reports three collisions on one date as a single entry", () => {
  const articles = [
    { slug: "a", author: "Jordan Kuo", publishDate: "2026-08-28" },
    { slug: "b", author: "Jordan Kuo", publishDate: "2026-08-28" },
    { slug: "c", author: "Jordan Kuo", publishDate: "2026-08-28" },
  ];
  const hits = findSameDateBylineCollisions(articles);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].slugs.length, 3);
});

test("ignores entries missing an author or a date", () => {
  const articles = [
    { slug: "a", author: "Alex Reeves" },
    { slug: "b", author: "Alex Reeves" },
    { slug: "c", publishDate: "2026-08-28" },
    { slug: "d", publishDate: "2026-08-28" },
  ];
  assert.deepEqual(findSameDateBylineCollisions(articles), []);
});

test("finds a collision inside a recent-window slice", () => {
  const articles = [
    { slug: "a", author: "Alex Reeves", publishDate: "2026-08-28" },
    { slug: "b", author: "Alex Reeves", publishDate: "2026-08-28" },
    { slug: "c", author: "Nina Castillo", publishDate: "2026-01-01" },
  ];
  const hits = findSameDateBylineCollisions(articles.slice(0, 2));
  assert.equal(hits.length, 1);
  assert.deepEqual(hits[0].slugs, ["a", "b"]);
});

test("does not find a collision that falls outside a recent-window slice", () => {
  const articles = [
    { slug: "a", author: "Nina Castillo", publishDate: "2026-08-28" },
    { slug: "b", author: "Jordan Kuo", publishDate: "2026-08-27" },
    { slug: "c", author: "Sam Whitfield", publishDate: "2026-01-05" },
    { slug: "d", author: "Sam Whitfield", publishDate: "2026-01-05" },
  ];
  const hits = findSameDateBylineCollisions(articles.slice(0, 2));
  assert.deepEqual(hits, []);
});

// Per the site owner, two articles by one writer on one date is acceptable
// and common; this is not a rule violation. findSameDateBylineCollisions
// still detects and reports doubles (that part of its behavior is unchanged),
// but the finding is advisory only. The calling script never fails a build
// over it; only check:rotation's 3-in-a-row rule is a real gate.
test("still detects a same-date double as an advisory finding, not a failure", () => {
  const articles = [
    { slug: "a", author: "Alex Reeves", publishDate: "2026-08-28" },
    { slug: "b", author: "Alex Reeves", publishDate: "2026-08-28" },
  ];
  const hits = findSameDateBylineCollisions(articles);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].author, "Alex Reeves");
});
