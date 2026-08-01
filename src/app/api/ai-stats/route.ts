import * as fs from "fs/promises";
import { createReadStream } from "fs";
import * as readline from "readline";
import * as zlib from "zlib";
import { promisify } from "util";
import {
  AI_BOTS,
  generateAiStatsFromLines,
  type AiStatsResponse,
} from "@/lib/stats/ai-aggregate";

const gunzip = promisify(zlib.gunzip);

// The /var/log/nginx directory is mounted read-only into the container
// (docker-compose.yml). This endpoint is intentionally SEPARATE from
// /api/stats: that one feeds the external WebTraffic Tracker on a fixed
// contract and must stay byte-for-byte stable. All AI-traffic reporting
// lives here so it can grow freely.
export const dynamic = "force-dynamic";

const ACCESS_LOG = "/var/log/nginx/access.log";
const CACHE_TTL = 60 * 1000; // 60s




// Yields every line of the last-24h logs without holding a file in memory.
// access.log (today) + access.log.1 (yesterday, full) always covers a rolling
// 24h window regardless of time of day, since rotation runs at 00:00.
async function* readLast24hLines(): AsyncGenerator<string> {
  for (const f of [ACCESS_LOG, ACCESS_LOG + ".1"]) {
    let stream: ReturnType<typeof createReadStream>;
    try {
      stream = createReadStream(f);
    } catch {
      continue; // Missing (e.g. before first rotation) or unreadable.
    }
    // A read error must not abort the other file, so swallow it and move on.
    let failed = false;
    stream.on("error", () => {
      failed = true;
    });
    try {
      const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
      for await (const line of rl) {
        if (line) yield line;
      }
    } catch {
      // Stream died mid-read; whatever was yielded still counts.
    }
    if (failed) continue;
  }
}

interface TrendDay {
  date: string;
  chatgptUser: number;
  aiTotal: number;
}

const TREND_TOKENS = AI_BOTS.map((b) => b.token);

async function readRotated(index: number): Promise<string | null> {
  // index 1 = access.log.1 (plain, yesterday); index >= 2 = access.log.N.gz
  const path = `${ACCESS_LOG}.${index}${index >= 2 ? ".gz" : ""}`;
  try {
    if (index >= 2) {
      const buf = await fs.readFile(path);
      return (await gunzip(buf)).toString("utf-8");
    }
    return await fs.readFile(path, "utf-8");
  } catch {
    return null;
  }
}

async function generateTrend(days: number): Promise<TrendDay[]> {
  const out: TrendDay[] = [];
  const oneDay = 24 * 60 * 60 * 1000;
  for (let i = 1; i <= days; i++) {
    const content = await readRotated(i);
    const date = new Date(Date.now() - i * oneDay).toISOString().slice(0, 10);
    if (content === null) {
      out.push({ date, chatgptUser: 0, aiTotal: 0 });
      continue;
    }
    let chatgptUser = 0;
    let aiTotal = 0;
    for (const line of content.split("\n")) {
      if (!line) continue;
      const lower = line.toLowerCase();
      if (lower.includes("chatgpt-user")) chatgptUser++;
      for (const t of TREND_TOKENS) {
        if (lower.includes(t)) {
          aiTotal++;
          break;
        }
      }
    }
    out.push({ date, chatgptUser, aiTotal });
  }
  return out;
}

let cached: AiStatsResponse | null = null;
let cachedAt = 0;

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=60",
};

export async function GET(request: Request) {
  const now = Date.now();
  const url = new URL(request.url);
  const trendParam = parseInt(url.searchParams.get("trend") || "0", 10);
  const trendDays = Number.isFinite(trendParam) ? Math.min(Math.max(trendParam, 0), 14) : 0;

  try {
    let base = cached;
    if (!base || now - cachedAt >= CACHE_TTL) {
      base = await generateAiStatsFromLines(readLast24hLines());
      cached = base;
      cachedAt = now;
    }

    const payload: AiStatsResponse & { trend?: TrendDay[] } = { ...base };
    if (trendDays > 0) {
      payload.trend = await generateTrend(trendDays);
    }

    return new Response(JSON.stringify(payload), { headers: CORS });
  } catch (err) {
    console.error("Failed to generate AI stats:", err);
    return new Response(JSON.stringify({ error: "Failed to generate AI stats" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
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
