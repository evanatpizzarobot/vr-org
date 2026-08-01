// Run: npx --yes tsx src/lib/stats/ai-aggregate.test.ts
// Standalone assertions (repo has no test framework). Exits non-zero on failure.
//
// Guards the 2026-08-01 streaming conversion. The route used to readFile the
// whole access log (60MB) and split("\n") it, the same shape that produced the
// /console heap-OOM 502s on 2026-07-20. It now folds an async iterable of lines.
// The critical property is that streaming changed only HOW lines arrive, never
// what they add up to, so the main test feeds identical input through a
// line-at-a-time iterator and a whole-file iterator and demands byte-identical
// reports.
import { generateAiStatsFromContents } from "./ai-aggregate";

let failures = 0;
function eq(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    failures++;
    console.error(`FAIL ${label}\n  expected ${e}\n  got      ${a}`);
  } else {
    console.log(`ok   ${label}`);
  }
}

// Lines must be inside the rolling 24h window or they are dropped, so stamp
// them relative to now rather than hardcoding a date.
function stamp(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60_000);
  const p = (n: number) => String(n).padStart(2, "0");
  const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${p(d.getUTCDate())}/${MON[d.getUTCMonth()]}/${d.getUTCFullYear()}:${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} +0000`;
}

const CGU =
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot";
const HUMAN =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const MONITOR = "Mozilla/5.0+(compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)";

function line(
  ip: string,
  path: string,
  status: number,
  referer: string,
  ua: string,
  minutesAgo = 30
): string {
  return `${ip} - - [${stamp(minutesAgo)}] "GET ${path} HTTP/1.1" ${status} 1234 "${referer}" "${ua}"`;
}

const lines = [
  // Two humans on real pages: 2 pageviews, 2 unique visitors.
  line("9.9.9.1", "/best-vr-headsets", 200, "-", HUMAN),
  line("9.9.9.2", "/steam-frame", 200, "https://www.google.com/", HUMAN),
  // Same human again: another pageview, still one visitor.
  line("9.9.9.1", "/ar-glasses", 200, "-", HUMAN),
  // Assets must never count as pageviews or inflate visitors.
  line("9.9.9.3", "/_next/static/chunks/main.js", 200, "https://vr.org/x", HUMAN),
  line("9.9.9.4", "/logo.png", 200, "https://vr.org/x", HUMAN),
  line("9.9.9.5", "/fonts/a.woff2", 200, "https://vr.org/x", HUMAN),
  // A human 404 and a human 500.
  line("9.9.9.6", "/does-not-exist", 404, "-", HUMAN),
  line("9.9.9.7", "/boom", 500, "-", HUMAN),
  // Bot traffic must be excluded from human totals entirely.
  line("5.5.5.1", "/steam-frame", 200, "-", CGU),
  line("5.5.5.1", "/vr-release-dates", 200, "-", CGU),
  line("5.5.5.2", "/best-vr-games", 200, "-", CGU),
  // Monitor noise is dropped before any tally.
  line("7.7.7.1", "/", 200, "-", MONITOR),
  // AI referral: a human arriving from ChatGPT with the utm tag.
  line("9.9.9.8", "/best-budget-vr-headset?utm_source=chatgpt", 200, "https://chatgpt.com/", HUMAN),
  // An ASSET whose REFERER contains the utm tag. This is the trap: counting
  // utm from the referer instead of the request path inflates referrals ~9x.
  line("9.9.9.8", "/_next/static/chunks/x.js", 200, "https://vr.org/best-budget-vr-headset?utm_source=chatgpt", HUMAN),
  line("9.9.9.8", "/logo.png", 200, "https://vr.org/best-budget-vr-headset?utm_source=chatgpt", HUMAN),
];

async function main() {
  const wholeFile = [lines.join("\n")];
  const lineByLine = lines.map((l) => l);

  const a = await generateAiStatsFromContents(wholeFile);
  const b = await generateAiStatsFromContents(lineByLine);

  // The whole point of the refactor: chunking must not change the result.
  eq(
    "streaming line-by-line == whole-file, entire report",
    { ...b, fetchedAt: 0 },
    { ...a, fetchedAt: 0 }
  );

  // Human totals exclude bots, monitors, and assets.
  eq("human.pageviews counts only real pages", a.human.pageviews, 6);
  // 6 pageviews but 5 visitors: 9.9.9.1 appears twice, and the three
  // asset-only IPs (.3/.4/.5) never become visitors at all.
  eq("human.uniqueVisitors excludes bot and monitor IPs", a.human.uniqueVisitors, 5);
  eq("human.status2xx", a.human.status2xx, 4);
  eq("human.status4xx", a.human.status4xx, 1);
  eq("human.status5xx", a.human.status5xx, 1);

  // Referral counting must read the request path, never the referer, or the two
  // asset rows above would triple it.
  eq("AI referral counted once, not once per asset", a.referrals.total, 1);
  eq("referral attributed to chatgpt", a.referrals.bySource.chatgpt, 1);

  // Bots still tallied separately.
  eq("ChatGPT-User hits", a.chatgptUser.hits, 3);
  eq("ChatGPT-User unique IPs", a.chatgptUser.uniqueIps, 2);

  // Assets excluded from top pages.
  eq(
    "humanTopPages has no asset paths",
    a.humanTopPages.filter((p) => p.path.startsWith("/_next") || p.path.endsWith(".png")).length,
    0
  );

  // An empty log must not throw and must report zeros.
  const empty = await generateAiStatsFromContents([]);
  eq("empty input yields zero pageviews", empty.human.pageviews, 0);
  eq("empty input yields zero visitors", empty.human.uniqueVisitors, 0);

  if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed`);
    process.exit(1);
  }
  console.log("\nAll ai-stats assertions passed");

}

main();
