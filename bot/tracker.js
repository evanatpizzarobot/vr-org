const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const TRACKER_PATH = path.join(__dirname, "..", "data", "posted-tweets.json");

function load() {
  try {
    if (fs.existsSync(TRACKER_PATH)) {
      return JSON.parse(fs.readFileSync(TRACKER_PATH, "utf-8"));
    }
  } catch {
    // corrupted file, start fresh
  }
  return { articles: {}, rss: {}, lastEngagementPost: null };
}

function save(data) {
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(data, null, 2));
}

function hashUrl(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function wasPostedRecently(tracker, key, section, hoursAgo = 48) {
  const timestamp = tracker[section]?.[key];
  if (!timestamp) return false;
  const cutoff = Date.now() - hoursAgo * 60 * 60 * 1000;
  return new Date(timestamp).getTime() > cutoff;
}

function markPosted(tracker, key, section) {
  if (!tracker[section]) tracker[section] = {};
  tracker[section][key] = new Date().toISOString();
  save(tracker);
}

function pruneOldEntries(tracker, daysToKeep = 7) {
  const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
  for (const section of ["articles", "rss"]) {
    if (!tracker[section]) continue;
    for (const [key, ts] of Object.entries(tracker[section])) {
      if (new Date(ts).getTime() < cutoff) {
        delete tracker[section][key];
      }
    }
  }
  save(tracker);
}

module.exports = { load, save, hashUrl, wasPostedRecently, markPosted, pruneOldEntries };
