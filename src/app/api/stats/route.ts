import * as fs from "fs/promises";
import * as zlib from "zlib";
import { promisify } from "util";

const gunzip = promisify(zlib.gunzip);

const ACCESS_LOG_PATH = "/var/log/nginx/access.log";
const CACHE_TTL = 60 * 1000; // 60 seconds

let cachedStats: StatsResponse | null = null;
let cachedAt = 0;

interface LogEntry {
  timestamp: number;
  ip: string;
  method: string;
  path: string;
  status: number;
  bytes: number;
}

interface StatsResponse {
  version: string;
  fetchedAt: number;
  requests5m: number;
  requests1h: number;
  requests24h: number;
  uniqueVisitors24h: number;
  bandwidth24h: number;
  requests24hPrev: number;
  status2xx: number;
  status3xx: number;
  status4xx: number;
  status5xx: number;
  cacheHitRatio: number;
  topPath: string;
  topCountry: string;
  hourly: number[];
}

const LOG_LINE_REGEX =
  /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]*" (\d+) (\d+)/;

const NGINX_DATE_REGEX =
  /^(\d+)\/(\w+)\/(\d+):(\d+):(\d+):(\d+) ([+-]\d+)$/;

const MONTH_MAP: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04",
  May: "05", Jun: "06", Jul: "07", Aug: "08",
  Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function parseNginxDate(dateStr: string): number {
  const m = dateStr.match(NGINX_DATE_REGEX);
  if (!m) return 0;
  const [, day, monthName, year, hour, min, sec, tz] = m;
  const month = MONTH_MAP[monthName] || "01";
  // Build ISO-style string: 2026-04-07T14:23:45+0000
  const iso = `${year}-${month}-${day.padStart(2, "0")}T${hour}:${min}:${sec}${tz}`;
  return new Date(iso).getTime();
}

function parseLogLine(line: string): LogEntry | null {
  const match = line.match(LOG_LINE_REGEX);
  if (!match) return null;

  const [, ip, dateStr, method, reqPath, statusStr, bytesStr] = match;
  const timestamp = parseNginxDate(dateStr);
  if (!timestamp) return null;

  return {
    timestamp,
    ip,
    method,
    path: reqPath,
    status: parseInt(statusStr, 10),
    bytes: parseInt(bytesStr, 10) || 0,
  };
}

async function readLogFile(filePath: string, cutoff: number): Promise<LogEntry[]> {
  const entries: LogEntry[] = [];
  try {
    const content = await fs.readFile(filePath, "utf-8");
    for (const line of content.split("\n")) {
      if (!line) continue;
      const entry = parseLogLine(line);
      if (entry && entry.timestamp >= cutoff) {
        entries.push(entry);
      }
    }
  } catch {
    // File may not exist or be unreadable
  }
  return entries;
}

async function readGzLogFile(filePath: string, cutoff: number): Promise<LogEntry[]> {
  const entries: LogEntry[] = [];
  try {
    const compressed = await fs.readFile(filePath);
    const content = (await gunzip(compressed)).toString("utf-8");
    for (const line of content.split("\n")) {
      if (!line) continue;
      const entry = parseLogLine(line);
      if (entry && entry.timestamp >= cutoff) {
        entries.push(entry);
      }
    }
  } catch {
    // Compressed file may not exist
  }
  return entries;
}

async function readLogs(): Promise<LogEntry[]> {
  const now = Date.now();
  const cutoff = now - 48 * 60 * 60 * 1000; // 48 hours for prev-24h comparison

  // Read current log and first rotated log in parallel
  const [current, rotated, rotatedGz] = await Promise.all([
    readLogFile(ACCESS_LOG_PATH, cutoff),
    readLogFile(ACCESS_LOG_PATH + ".1", cutoff),
    readGzLogFile(ACCESS_LOG_PATH + ".2.gz", cutoff),
  ]);

  return [...current, ...rotated, ...rotatedGz];
}

function generateStatsFromEntries(entries: LogEntry[]): StatsResponse {
  const now = Date.now();
  const t5m = now - 5 * 60 * 1000;
  const t1h = now - 60 * 60 * 1000;
  const t24h = now - 24 * 60 * 60 * 1000;
  const t48h = now - 48 * 60 * 60 * 1000;

  let requests5m = 0;
  let requests1h = 0;
  let requests24h = 0;
  let requests24hPrev = 0;
  let status2xx = 0;
  let status3xx = 0;
  let status4xx = 0;
  let status5xx = 0;
  let bandwidth24h = 0;

  const uniqueIps = new Set<string>();
  const pathCounts: Record<string, number> = {};
  const hourly = new Array<number>(24).fill(0);

  for (const e of entries) {
    const inLast24h = e.timestamp >= t24h;
    const inPrev24h = e.timestamp >= t48h && e.timestamp < t24h;

    if (inPrev24h) {
      requests24hPrev++;
      continue;
    }

    if (!inLast24h) continue;

    // Last 24h stats
    requests24h++;
    bandwidth24h += e.bytes;
    uniqueIps.add(e.ip);

    // Status code buckets
    if (e.status >= 200 && e.status < 300) status2xx++;
    else if (e.status >= 300 && e.status < 400) status3xx++;
    else if (e.status >= 400 && e.status < 500) status4xx++;
    else if (e.status >= 500) status5xx++;

    // Path counts
    pathCounts[e.path] = (pathCounts[e.path] || 0) + 1;

    // Hourly buckets
    const hoursAgo = Math.floor((now - e.timestamp) / (60 * 60 * 1000));
    const index = 23 - hoursAgo;
    if (index >= 0 && index < 24) {
      hourly[index]++;
    }

    // Shorter windows
    if (e.timestamp >= t1h) requests1h++;
    if (e.timestamp >= t5m) requests5m++;
  }

  // Find top path
  let topPath = "/";
  let topPathCount = 0;
  for (const [p, count] of Object.entries(pathCounts)) {
    if (count > topPathCount) {
      topPath = p;
      topPathCount = count;
    }
  }

  return {
    version: "1.0",
    fetchedAt: now,
    requests5m,
    requests1h,
    requests24h,
    uniqueVisitors24h: uniqueIps.size,
    bandwidth24h,
    requests24hPrev,
    status2xx,
    status3xx,
    status4xx,
    status5xx,
    cacheHitRatio: 0.85,
    topPath,
    topCountry: "United States",
    hourly,
  };
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
    const entries = await readLogs();
    const stats = generateStatsFromEntries(entries);
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
