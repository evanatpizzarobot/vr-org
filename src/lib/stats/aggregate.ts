// Pure, streaming-friendly aggregation for nginx access-log stats.
//
// The route feeds log lines in one at a time (via readline over a file stream)
// and folds each into a small accumulator. Nothing holds a whole log file in
// memory: peak memory is the counters + the unique-IP set + the path-count map,
// not the 30MB+ raw log text. This replaces the old readFile + split("\n")
// approach that transiently allocated hundreds of MB per refresh and pushed the
// container's V8 heap past its cap (see docker-compose.yml, diagnosed 2026-07-20).

export interface StatsResponse {
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
  // cacheHitRatio and topCountry are contract placeholders required by the
  // WebTraffic Tracker ingestion worker (VR_ORG_STATS_SPEC.md): nginx access
  // logs carry neither cache status nor geo data, so per the spec v1 sends
  // 0 and "unknown" rather than fabricated numbers.
  cacheHitRatio: number;
  topPath: string;
  topCountry: string;
  hourly: number[];
}

interface LogEntry {
  timestamp: number;
  ip: string;
  method: string;
  path: string;
  status: number;
  bytes: number;
}

export interface TimeWindows {
  now: number;
  t5m: number;
  t1h: number;
  t24h: number;
  t48h: number;
}

export interface StatsAccumulator {
  requests5m: number;
  requests1h: number;
  requests24h: number;
  requests24hPrev: number;
  status2xx: number;
  status3xx: number;
  status4xx: number;
  status5xx: number;
  bandwidth24h: number;
  uniqueIps: Set<string>;
  pathCounts: Map<string, number>;
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

export function makeWindows(now: number): TimeWindows {
  return {
    now,
    t5m: now - 5 * 60 * 1000,
    t1h: now - 60 * 60 * 1000,
    t24h: now - 24 * 60 * 60 * 1000,
    t48h: now - 48 * 60 * 60 * 1000,
  };
}

export function createAccumulator(): StatsAccumulator {
  return {
    requests5m: 0,
    requests1h: 0,
    requests24h: 0,
    requests24hPrev: 0,
    status2xx: 0,
    status3xx: 0,
    status4xx: 0,
    status5xx: 0,
    bandwidth24h: 0,
    uniqueIps: new Set<string>(),
    pathCounts: new Map<string, number>(),
    hourly: new Array<number>(24).fill(0),
  };
}

// Parse a single log line and fold it into the accumulator. Lines older than
// 48h, malformed lines, and empty lines are ignored. Order-independent for
// every field except top-path ties, which resolve to the first path seen at
// the winning count (feed files newest-first to match prior behavior).
export function addLine(
  acc: StatsAccumulator,
  line: string,
  w: TimeWindows
): void {
  const entry = parseLogLine(line);
  if (!entry) return;

  // Older than the 48h comparison window: irrelevant.
  if (entry.timestamp < w.t48h) return;

  // Previous 24h period ([t48h, t24h)): only feeds the comparison metric.
  if (entry.timestamp < w.t24h) {
    acc.requests24hPrev++;
    return;
  }

  // Last 24h.
  acc.requests24h++;
  acc.bandwidth24h += entry.bytes;
  acc.uniqueIps.add(entry.ip);

  if (entry.status >= 200 && entry.status < 300) acc.status2xx++;
  else if (entry.status >= 300 && entry.status < 400) acc.status3xx++;
  else if (entry.status >= 400 && entry.status < 500) acc.status4xx++;
  else if (entry.status >= 500) acc.status5xx++;

  acc.pathCounts.set(entry.path, (acc.pathCounts.get(entry.path) || 0) + 1);

  const hoursAgo = Math.floor((w.now - entry.timestamp) / (60 * 60 * 1000));
  const index = 23 - hoursAgo;
  if (index >= 0 && index < 24) acc.hourly[index]++;

  if (entry.timestamp >= w.t1h) acc.requests1h++;
  if (entry.timestamp >= w.t5m) acc.requests5m++;
}

export function finalize(acc: StatsAccumulator, now: number): StatsResponse {
  let topPath = "/";
  let topPathCount = 0;
  for (const [p, count] of acc.pathCounts) {
    if (count > topPathCount) {
      topPath = p;
      topPathCount = count;
    }
  }

  return {
    version: "1.0",
    fetchedAt: now,
    requests5m: acc.requests5m,
    requests1h: acc.requests1h,
    requests24h: acc.requests24h,
    uniqueVisitors24h: acc.uniqueIps.size,
    bandwidth24h: acc.bandwidth24h,
    requests24hPrev: acc.requests24hPrev,
    status2xx: acc.status2xx,
    status3xx: acc.status3xx,
    status4xx: acc.status4xx,
    status5xx: acc.status5xx,
    cacheHitRatio: 0,
    topPath,
    topCountry: "unknown",
    hourly: acc.hourly,
  };
}

// Convenience wrapper used by tests: fold an in-memory iterable of lines.
// The route uses createAccumulator + addLine directly against a file stream.
export function computeStatsFromLines(
  lines: Iterable<string>,
  now: number
): StatsResponse {
  const w = makeWindows(now);
  const acc = createAccumulator();
  for (const line of lines) addLine(acc, line, w);
  return finalize(acc, now);
}
