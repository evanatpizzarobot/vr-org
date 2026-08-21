// Knows what the @vrdotorg account has ALREADY shared, including posts Evan made by hand.
//
// The local tracker (posted-tweets.json) only records what this bot posted. When a link is
// shared manually from the account, the bot has no idea and re-posts the same article hours
// later. That happened on 2026-08-19 with the Steam Frame unboxing piece, and the only fix
// at the time was SSHing in to hand-edit posted-tweets.json.
//
// This module closes that gap by reading the account's own recent timeline and treating every
// vr.org article and outbound link it finds as already posted, whoever posted it.

const twitter = require("./twitter");
const tracker = require("./tracker");

// How far back a share counts as "already covered". The bot's own dedupe window is 48h, so
// anything beyond that cannot collide anyway; 7 days is margin, not a permanent block.
const LOOKBACK_HOURS = 7 * 24;

// Reuse a successful fetch for this long instead of hitting the API on every hourly cycle.
const CACHE_TTL_MS = 30 * 60 * 1000;

// Drop protocol, www, query string and fragment so utm tags and t.co expansion do not
// produce two different keys for the same page.
function normalizeUrl(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");
    return (host + path).toLowerCase();
  } catch {
    return null;
  }
}

function slugFromNormalized(norm) {
  if (!norm) return null;
  const m = /^vr\.org\/articles\/([^/]+)$/.exec(norm);
  return m ? m[1] : null;
}

// Pure: turns raw timeline tweets into the sets we filter against. Exported for testing.
function extract(tweets, { lookbackHours = LOOKBACK_HOURS, now = Date.now() } = {}) {
  const cutoff = now - lookbackHours * 60 * 60 * 1000;
  const urls = new Set();
  const slugs = new Set();
  const seenAt = {};

  for (const t of tweets || []) {
    if (t.created_at) {
      const ts = new Date(t.created_at).getTime();
      if (Number.isFinite(ts) && ts < cutoff) continue;
    }

    const candidates = [];

    // Long posts come back as note tweets: the top-level `text` is truncated at 280 chars
    // and top-level `entities` is absent entirely, so the real link only exists under
    // note_tweet. A roundup shared with all its headlines is exactly this shape, and
    // reading only the top level silently misses it.
    const entitySets = [t.entities, t.note_tweet && t.note_tweet.entities];
    for (const ents of entitySets) {
      for (const u of (ents && ents.urls) || []) {
        // expanded_url is the real destination; unwound_url appears when X followed a redirect.
        if (u.unwound_url) candidates.push(u.unwound_url);
        if (u.expanded_url) candidates.push(u.expanded_url);
      }
    }

    // Retweets and quotes can carry the link in the body rather than in entities.
    const texts = [t.text, t.note_tweet && t.note_tweet.text];
    for (const body of texts) {
      for (const m of String(body || "").matchAll(/https?:\/\/[^\s]+/g)) {
        candidates.push(m[0]);
      }
    }

    for (const c of candidates) {
      const norm = normalizeUrl(c);
      if (!norm) continue;
      // t.co wrappers carry no information once expansion has failed; ignore them.
      if (norm.startsWith("t.co/")) continue;
      urls.add(norm);
      if (!seenAt[norm] && t.created_at) seenAt[norm] = t.created_at;
      const slug = slugFromNormalized(norm);
      if (slug) {
        slugs.add(slug);
        if (!seenAt[slug] && t.created_at) seenAt[slug] = t.created_at;
      }
    }
  }

  return { urls: [...urls], slugs: [...slugs], seenAt };
}

function toView(snapshot, source) {
  const urls = new Set(snapshot.urls || []);
  const slugs = new Set(snapshot.slugs || []);
  const seenAt = snapshot.seenAt || {};
  return {
    source,
    fetchedAt: snapshot.fetchedAt || null,
    count: slugs.size + urls.size,
    hasSlug: (slug) => slugs.has(slug),
    hasUrl: (url) => {
      const n = normalizeUrl(url);
      return n ? urls.has(n) : false;
    },
    sharedAt: (key) => seenAt[key] || seenAt[normalizeUrl(key) || ""] || null,
  };
}

// Returns a view of what the account has already shared.
// Order of preference: fresh API read -> last persisted snapshot -> empty (local dedupe only).
async function load(posted, log = () => {}) {
  const cached = posted.timelineCache;
  if (cached && cached.fetchedAt) {
    const age = Date.now() - new Date(cached.fetchedAt).getTime();
    if (age >= 0 && age < CACHE_TTL_MS) {
      return toView(cached, "cache");
    }
  }

  try {
    const tweets = await twitter.getOwnRecentTweets();
    const snapshot = { ...extract(tweets), fetchedAt: new Date().toISOString() };
    posted.timelineCache = snapshot;
    tracker.save(posted);
    return toView(snapshot, "api");
  } catch (err) {
    if (cached && cached.fetchedAt) {
      log(
        `[TIMELINE] Read failed (${err.code || "?"}: ${err.message}). Falling back to snapshot from ${cached.fetchedAt}.`
      );
      return toView(cached, "stale-cache");
    }
    log(
      `[TIMELINE] Read failed (${err.code || "?"}: ${err.message}) and no snapshot exists. ` +
        `Manual shares cannot be detected this cycle; local dedupe only.`
    );
    return toView({}, "unavailable");
  }
}

module.exports = { load, extract, normalizeUrl, slugFromNormalized, LOOKBACK_HOURS, CACHE_TTL_MS };
