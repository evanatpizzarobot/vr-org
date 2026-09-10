import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseTimelineDate,
  extractDateArrays,
  findOrderViolations,
} from "../scripts/check-timeline-order.mjs";

test("parseTimelineDate reads a full house date", () => {
  assert.equal(parseTimelineDate("Sep 8, 2026"), Date.UTC(2026, 8, 8));
  assert.equal(parseTimelineDate("Mar 19, 2026"), Date.UTC(2026, 2, 19));
});

test("parseTimelineDate returns null for coarse labels that must not be sorted", () => {
  // These sit among full dates in PRICE_SIGNALS and DATE_SIGNALS. "Early 2026"
  // does not parse at all, and a month-only label would collapse to the 1st
  // and drag an entry that is placed deliberately.
  assert.equal(parseTimelineDate("Nov 2025"), null);
  assert.equal(parseTimelineDate("Early 2026"), null);
  assert.equal(parseTimelineDate("Jul 2026"), null);
  assert.equal(parseTimelineDate(""), null);
});

test("findOrderViolations accepts an oldest-first run", () => {
  const dates = ["Mar 19, 2026", "Aug 19, 2026", "Sep 6, 2026", "Sep 8, 2026"];
  assert.deepEqual(findOrderViolations(dates), []);
});

test("findOrderViolations accepts a newest-first run", () => {
  // /great-on-frame CHANGELOG is descending on purpose and says so in its own
  // caption, so direction is read from the array rather than assumed.
  const dates = ["Sep 8, 2026", "Sep 6, 2026", "Aug 24, 2026", "Jul 3, 2026"];
  assert.deepEqual(findOrderViolations(dates), []);
});

test("findOrderViolations flags the reversed tail a reader reported on /steam-frame", () => {
  const dates = [
    "Aug 10, 2026",
    "Aug 19, 2026",
    "Sep 8, 2026",
    "Sep 6, 2026",
    "Sep 1, 2026",
    "Aug 27, 2026",
    "Aug 24, 2026",
  ];
  const found = findOrderViolations(dates);
  assert.equal(found.length, 4);
  assert.deepEqual(found[0], { index: 3, previous: "Sep 8, 2026", current: "Sep 6, 2026" });
  assert.equal(found.at(-1).current, "Aug 24, 2026");
});

test("findOrderViolations flags a single stray entry", () => {
  // /steam-frame-price carried exactly this: Aug 24 parked after Sep 3.
  const dates = [
    "Jun 23, 2026",
    "Jul 24, 2026",
    "Aug 19, 2026",
    "Aug 28, 2026",
    "Sep 3, 2026",
    "Aug 24, 2026",
  ];
  const found = findOrderViolations(dates);
  assert.equal(found.length, 1);
  assert.equal(found[0].current, "Aug 24, 2026");
});

test("findOrderViolations skips coarse labels instead of tripping on them", () => {
  const dates = [
    "Nov 2025",
    "Early 2026",
    "Jun 23, 2026",
    "Jul 2026",
    "Jul 24, 2026",
    "Aug 19, 2026",
  ];
  assert.deepEqual(findOrderViolations(dates), []);
});

test("findOrderViolations stays quiet when direction cannot be established", () => {
  assert.deepEqual(findOrderViolations(["Sep 8, 2026", "Sep 6, 2026"]), []);
  assert.deepEqual(findOrderViolations(["Nov 2025", "Early 2026"]), []);
  assert.deepEqual(findOrderViolations([]), []);
});

test("findOrderViolations treats repeated dates as in order", () => {
  const dates = ["Apr 25, 2026", "Apr 25, 2026", "May 4, 2026", "May 4, 2026"];
  assert.deepEqual(findOrderViolations(dates), []);
});

test("extractDateArrays returns each dated array with its labels in source order", () => {
  const source = `
const TIMELINE: TimelineEntry[] = [
  {
    date: "Mar 19, 2026",
    slug: "a",
    text: "first",
  },
  {
    date: "Sep 8, 2026",
    slug: "b",
    text: "second",
  },
  {
    date: "Sep 6, 2026",
    slug: "c",
    text: "third",
  },
];
`;
  const arrays = extractDateArrays(source);
  assert.equal(arrays.length, 1);
  assert.equal(arrays[0].name, "TIMELINE");
  assert.deepEqual(arrays[0].dates, ["Mar 19, 2026", "Sep 8, 2026", "Sep 6, 2026"]);
});

test("extractDateArrays finds every dated array in a file", () => {
  const source = `
const PRICE_SIGNALS: PriceSignal[] = [
  { date: "Nov 2025", figure: "a" },
  { date: "Jun 23, 2026", figure: "b" },
  { date: "Sep 3, 2026", figure: "c" },
];
const CHANGELOG = [
  { date: "Sep 8, 2026", note: "a" },
  { date: "Sep 6, 2026", note: "b" },
  { date: "Aug 24, 2026", note: "c" },
];
`;
  const arrays = extractDateArrays(source);
  assert.deepEqual(arrays.map((a) => a.name), ["PRICE_SIGNALS", "CHANGELOG"]);
});

test("extractDateArrays ignores arrays too short to have an order", () => {
  const source = `
const PAIR = [
  { date: "Sep 8, 2026" },
  { date: "Sep 6, 2026" },
];
`;
  assert.deepEqual(extractDateArrays(source), []);
});
