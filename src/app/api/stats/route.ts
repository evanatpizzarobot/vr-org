import { createReadStream } from "fs";
import * as readline from "readline";
import * as zlib from "zlib";
import {
  createAccumulator,
  addLine,
  finalize,
  makeWindows,
  type StatsAccumulator,
  type TimeWindows,
  type StatsResponse,
} from "@/lib/stats/aggregate";

const ACCESS_LOG_PATH = "/var/log/nginx/access.log";
const CACHE_TTL = 60 * 1000; // 60 seconds

let cachedStats: StatsResponse | null = null;
let cachedAt = 0;

// Stream a log file line-by-line into the accumulator. Never materializes the
// whole file: readline yields one line at a time and addLine folds it into
// small counters. Missing or corrupt files resolve quietly (matching the old
// try/catch behavior) so one absent rotated log never fails the endpoint.
function streamLogInto(
  acc: StatsAccumulator,
  windows: TimeWindows,
  filePath: string,
  gzip: boolean
): Promise<void> {
  return new Promise<void>((resolve) => {
    const fileStream = createReadStream(filePath);
    fileStream.on("error", () => resolve());

    let input: NodeJS.ReadableStream = fileStream;
    if (gzip) {
      const gunzip = zlib.createGunzip();
      gunzip.on("error", () => resolve());
      input = fileStream.pipe(gunzip);
    }

    const rl = readline.createInterface({ input, crlfDelay: Infinity });
    rl.on("line", (line) => {
      if (line) addLine(acc, line, windows);
    });
    rl.on("close", () => resolve());
    rl.on("error", () => resolve());
  });
}

async function generateStats(now: number): Promise<StatsResponse> {
  const windows = makeWindows(now);
  const acc = createAccumulator();

  // Sequential, newest-first: preserves the previous top-path tie-break
  // (current log wins ties) and keeps only one stream open at a time. The 60s
  // cache amortizes the parse cost across requests.
  await streamLogInto(acc, windows, ACCESS_LOG_PATH, false);
  await streamLogInto(acc, windows, ACCESS_LOG_PATH + ".1", false);
  await streamLogInto(acc, windows, ACCESS_LOG_PATH + ".2.gz", true);

  return finalize(acc, now);
}

export async function GET() {
  const now = Date.now();

  if (cachedStats && now - cachedAt < CACHE_TTL) {
    return new Response(JSON.stringify(cachedStats), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  try {
    const stats = await generateStats(now);
    cachedStats = stats;
    cachedAt = now;

    return new Response(JSON.stringify(stats), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    console.error("Failed to generate stats:", err);
    return new Response(JSON.stringify({ error: "Failed to generate stats" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
