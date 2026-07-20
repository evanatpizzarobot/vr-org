// Run: npx --yes tsx src/lib/stats/aggregate.test.ts
// Standalone assertions (repo has no test framework). Exits non-zero on failure.
import { computeStatsFromLines } from "./aggregate";

let failures = 0;
function eq(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    failures++;
    console.error(`FAIL ${label}: expected ${e}, got ${a}`);
  } else {
    console.log(`ok   ${label}`);
  }
}

// Fixed reference time so windows are deterministic.
const NOW = Date.parse("2026-07-20T18:00:00+0000");
// t5m=17:55, t1h=17:00, t24h=Jul19 18:00, t48h=Jul18 18:00

const lines = [
  // in last 5m (=> 5m, 1h, 24h); ip .1; 2xx; /a; 100 bytes
  '1.1.1.1 - - [20/Jul/2026:17:58:00 +0000] "GET /a HTTP/1.1" 200 100',
  // in last 1h not 5m; ip .2; 2xx; /a; 200
  '1.1.1.2 - - [20/Jul/2026:17:30:00 +0000] "GET /a HTTP/1.1" 200 200',
  // in last 24h not 1h; ip .1 (dup); 4xx; /b; 50
  '1.1.1.1 - - [20/Jul/2026:10:00:00 +0000] "GET /b HTTP/1.1" 404 50',
  // in last 24h; ip .3; 5xx; /c; 0
  '1.1.1.3 - - [20/Jul/2026:09:00:00 +0000] "GET /c HTTP/1.1" 500 0',
  // in last 24h (Jul19 20:00 >= Jul19 18:00); ip .4; 3xx; /a; 10
  '1.1.1.4 - - [19/Jul/2026:20:00:00 +0000] "GET /a HTTP/1.1" 301 10',
  // in prev 24h window (Jul19 10:00, between t48h and t24h); counts as prev only
  '1.1.1.5 - - [19/Jul/2026:10:00:00 +0000] "GET /x HTTP/1.1" 200 999',
  // older than 48h => dropped entirely
  '1.1.1.6 - - [18/Jul/2026:10:00:00 +0000] "GET /y HTTP/1.1" 200 999',
  // malformed => dropped
  "garbage line not matching",
  // empty => dropped
  "",
];

const s = computeStatsFromLines(lines, NOW);

eq("requests5m", s.requests5m, 1);
eq("requests1h", s.requests1h, 2);
eq("requests24h", s.requests24h, 5);
eq("requests24hPrev", s.requests24hPrev, 1);
eq("bandwidth24h", s.bandwidth24h, 360);
eq("uniqueVisitors24h", s.uniqueVisitors24h, 4);
eq("status2xx", s.status2xx, 2);
eq("status3xx", s.status3xx, 1);
eq("status4xx", s.status4xx, 1);
eq("status5xx", s.status5xx, 1);
eq("topPath", s.topPath, "/a");
eq("cacheHitRatio", s.cacheHitRatio, 0);
eq("topCountry", s.topCountry, "unknown");
eq("version", s.version, "1.0");
eq("fetchedAt", s.fetchedAt, NOW);

// hourly: index = 23 - hoursAgo(floor). line1&2 -> idx23, line3 (8h) -> idx15,
// line4 (9h) -> idx14, line5 (22h) -> idx1. Sum must equal requests24h.
const expectedHourly = new Array(24).fill(0);
expectedHourly[23] = 2;
expectedHourly[15] = 1;
expectedHourly[14] = 1;
expectedHourly[1] = 1;
eq("hourly", s.hourly, expectedHourly);
eq("hourly-sum-equals-24h", s.hourly.reduce((a, b) => a + b, 0), s.requests24h);

// Empty input => all zeros, safe defaults.
const empty = computeStatsFromLines([], NOW);
eq("empty.requests24h", empty.requests24h, 0);
eq("empty.uniqueVisitors24h", empty.uniqueVisitors24h, 0);
eq("empty.topPath", empty.topPath, "/");

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed`);
  process.exit(1);
}
console.log("\nAll assertions passed");
