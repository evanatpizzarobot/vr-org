// Lightweight adoption metrics for the remote MCP endpoint.
//
// In-memory counters in the long-lived Node process (same singleton pattern as
// the RSS engine), flushed to data/mcp-stats.json at most once a minute. Stores
// ONLY aggregate counts: per-day request totals, per-tool call counts, and a
// coarse client class derived from the User-Agent. No IPs, no raw UA strings,
// no payloads. Every public function is wrapped so a stats failure can never
// break an MCP request.

import fs from "fs";
import path from "path";

// Assistants: claude, openai, perplexity, cursor, vscode.
// Non-assistant automated traffic: directory (MCP registries/catalog crawlers),
// monitor (uptime monitors + security scanners), sdk (generic HTTP clients / CLIs).
// other: genuine residual (empty UA, random browsers, incidental crawlers).
export type UaClass =
  | "claude"
  | "openai"
  | "cursor"
  | "vscode"
  | "perplexity"
  | "directory"
  | "monitor"
  | "sdk"
  | "other";

interface DayCounts {
  requests: number;
  tools: Record<string, number>;
  clients: Record<string, number>;
}

interface StatsFile {
  days: Record<string, DayCounts>;
  updatedAt: string;
}

export interface McpStatsSnapshot {
  version: string;
  generatedAt: string;
  totalRequests7d: number;
  totalRequests30d: number;
  tools30d: Record<string, number>;
  clients30d: Record<string, number>;
  days: { date: string; requests: number }[];
}

const STATS_PATH = path.join(process.cwd(), "data", "mcp-stats.json");
const FLUSH_MS = 60_000;
const KEEP_DAYS = 90;

let days: Record<string, DayCounts> | null = null;
let dirty = false;
let flushTimer: NodeJS.Timeout | null = null;

function load(): Record<string, DayCounts> {
  if (days) return days;
  try {
    const parsed = JSON.parse(fs.readFileSync(STATS_PATH, "utf-8")) as StatsFile;
    const raw = parsed.days && typeof parsed.days === "object" ? parsed.days : {};
    // Normalize each day defensively: a hand-edited or partially written file
    // must never be able to crash a reader downstream.
    const clean: Record<string, DayCounts> = {};
    for (const [key, value] of Object.entries(raw)) {
      const v = value as Partial<DayCounts> | null;
      clean[key] = {
        requests: typeof v?.requests === "number" ? v.requests : 0,
        tools: v?.tools && typeof v.tools === "object" ? v.tools : {},
        clients: v?.clients && typeof v.clients === "object" ? v.clients : {},
      };
    }
    days = clean;
  } catch {
    days = {};
  }
  return days;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayBucket(): DayCounts {
  const all = load();
  const key = todayKey();
  if (!all[key]) all[key] = { requests: 0, tools: {}, clients: {} };
  return all[key];
}

function prune(): void {
  const all = load();
  const keys = Object.keys(all).sort();
  while (keys.length > KEEP_DAYS) {
    delete all[keys.shift() as string];
  }
}

async function flush(): Promise<void> {
  if (!dirty || !days) return;
  dirty = false;
  try {
    prune();
    const out: StatsFile = { days, updatedAt: new Date().toISOString() };
    await fs.promises.writeFile(STATS_PATH, JSON.stringify(out, null, 2));
  } catch {
    // Never throw from stats; retry on the next flush window.
    dirty = true;
  }
}

function scheduleFlush(): void {
  dirty = true;
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_MS);
  // Do not hold the process open for a stats write.
  flushTimer.unref?.();
}

export function classifyUa(ua: string | null): UaClass {
  const s = (ua || "").toLowerCase();
  // Assistants (named AI clients and their bots). OpenAI first so GPTBot /
  // OAI-SearchBot count as OpenAI rather than falling through to "other".
  if (s.includes("openai") || s.includes("chatgpt") || s.includes("gptbot") || s.includes("oai-searchbot")) return "openai";
  if (s.includes("claude")) return "claude"; // Claude-User (live sessions), ClaudeBot
  if (s.includes("perplexity")) return "perplexity";
  if (s.includes("cursor")) return "cursor";
  if (s.includes("vscode") || s.includes("visual studio code")) return "vscode";
  // MCP directories / registries / catalog crawlers indexing the server.
  if (
    s.includes("smithery") ||
    s.includes("mcpregistry") ||
    s.includes("mcp-registry") ||
    s.includes("agent-tools") ||
    s.includes("glama") ||
    s.includes("pulsemcp") ||
    s.includes("modelcontextprotocol")
  )
    return "directory";
  // Uptime monitors + security scanners probing the endpoint.
  if (
    s.includes("infrawatch") ||
    s.includes("uptimerobot") ||
    s.includes("pingdom") ||
    s.includes("betteruptime") ||
    s.includes("scanner") ||
    s.includes("virustotal") ||
    s.includes("censys") ||
    s.includes("shodan")
  )
    return "monitor";
  // Generic programmatic HTTP clients / CLIs (real callers, just unlabeled).
  if (
    s.includes("curl") ||
    s.includes("httpx") ||
    s.includes("python-requests") ||
    s.includes("go-http-client") ||
    s.includes("okhttp") ||
    s.includes("undici") ||
    s.includes("node-fetch") ||
    s === "node" ||
    s.includes("axios") ||
    s.includes("postman") ||
    s.includes("wget") ||
    s.includes("libwww")
  )
    return "sdk";
  return "other";
}

export function recordRequest(client: UaClass): void {
  try {
    const day = dayBucket();
    day.requests += 1;
    day.clients[client] = (day.clients[client] || 0) + 1;
    scheduleFlush();
  } catch {
    // Stats must never break the request path.
  }
}

export function recordToolCall(tool: string): void {
  try {
    const day = dayBucket();
    day.tools[tool] = (day.tools[tool] || 0) + 1;
    scheduleFlush();
  } catch {
    // Stats must never break the request path.
  }
}

export function getMcpStats(): McpStatsSnapshot {
  try {
    const all = load();
    const dates = Object.keys(all).sort().slice(-30);
    const cutoff7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    let total7 = 0;
    let total30 = 0;
    const tools: Record<string, number> = {};
    const clients: Record<string, number> = {};
    const dayRows: { date: string; requests: number }[] = [];
    for (const d of dates) {
      const day = all[d];
      total30 += day.requests;
      if (d >= cutoff7) total7 += day.requests;
      for (const [k, v] of Object.entries(day.tools)) tools[k] = (tools[k] || 0) + v;
      for (const [k, v] of Object.entries(day.clients)) clients[k] = (clients[k] || 0) + v;
      dayRows.push({ date: d, requests: day.requests });
    }
    return {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      totalRequests7d: total7,
      totalRequests30d: total30,
      tools30d: tools,
      clients30d: clients,
      days: dayRows,
    };
  } catch {
    // Aggregation must never throw into an HTTP route; degrade to an empty snapshot.
    return {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      totalRequests7d: 0,
      totalRequests30d: 0,
      tools30d: {},
      clients30d: {},
      days: [],
    };
  }
}
