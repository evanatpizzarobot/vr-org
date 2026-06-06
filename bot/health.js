const fs = require("fs");
const path = require("path");

// Volume-mounted data dir, same file the Next.js /api/bot-health route reads.
const HEALTH_PATH = path.join(__dirname, "..", "data", "bot-health.json");

function defaultState() {
  return {
    lastCheckAt: null, // heartbeat: updated every cycle, even idle ones
    lastSuccessAt: null,
    lastErrorAt: null,
    lastErrorCode: null, // null when the last attempt succeeded; set while failing
    lastErrorMessage: null,
    consecutiveFailures: 0,
  };
}

function load() {
  try {
    if (fs.existsSync(HEALTH_PATH)) {
      return { ...defaultState(), ...JSON.parse(fs.readFileSync(HEALTH_PATH, "utf-8")) };
    }
  } catch {
    // corrupted file, start fresh
  }
  return defaultState();
}

function save(data) {
  fs.writeFileSync(HEALTH_PATH, JSON.stringify(data, null, 2));
}

// Called at the top of every cycle so a stopped/crashed process surfaces as a stale heartbeat.
function recordHeartbeat() {
  const h = load();
  h.lastCheckAt = new Date().toISOString();
  save(h);
}

function recordSuccess() {
  const h = load();
  const now = new Date().toISOString();
  h.lastCheckAt = now;
  h.lastSuccessAt = now;
  h.consecutiveFailures = 0;
  h.lastErrorCode = null;
  h.lastErrorMessage = null;
  save(h);
}

function recordFailure(code, message) {
  const h = load();
  const now = new Date().toISOString();
  h.lastCheckAt = now;
  h.lastErrorAt = now;
  h.lastErrorCode = code != null ? code : "unknown";
  h.lastErrorMessage = message || "";
  h.consecutiveFailures = (h.consecutiveFailures || 0) + 1;
  save(h);
}

module.exports = { load, recordHeartbeat, recordSuccess, recordFailure };
