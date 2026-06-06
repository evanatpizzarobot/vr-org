require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const { postTweet } = require("./twitter");
const content = require("./content");
const formatter = require("./formatter");
const tracker = require("./tracker");
const health = require("./health");

const LOG_PATH = path.join(__dirname, "bot.log");
const DRY_RUN = process.env.DRY_RUN === "true";

// --- Posting limits ---
// Two slots per day, one post each, so 2 posts/day maximum:
//   Slot 1: one new original article (published in the last 48h, not yet tweeted)
//   Slot 2: one notable news headline (only if it clears the notability bar in content.js)
// On a day with no new original AND no notable news, the account stays silent (by design).
const DAILY_MAX = 2;
const MIN_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours between posts

function log(msg) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n");
}

function getPtHour() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  return (utcHour - 7 + 24) % 24;
}

async function tryPost(text, label) {
  if (DRY_RUN) {
    log(`[DRY RUN] Would post (${label}):\n${text}\n---`);
    return true;
  }
  try {
    const result = await postTweet(text);
    log(`[POSTED] (${label}) id=${result.id}`);
    health.recordSuccess();
    return true;
  } catch (err) {
    if (err.code === 402) {
      // 402 Payment Required: the X API balance is out of credit (or the plan lapsed).
      // This is NOT a rate limit. Posting stays paused until the balance is topped up.
      log(`[BILLING/CREDIT ERROR] X API returned 402 Payment Required, out of credit or plan issue. Posting is paused until the X API balance is topped up. ${err.message}`);
    } else if (err.code === 429) {
      log(`[RATE LIMITED] Will retry next cycle. ${err.message}`);
    } else {
      log(`[ERROR] Failed to post (${label}): ${err.message}`);
    }
    health.recordFailure(err.code, err.message);
    return false;
  }
}

function recordPost(posted, type) {
  tracker.incrementDailyCount(posted, type);
  posted.lastPostTime = new Date().toISOString();
  tracker.save(posted);
}

async function checkAndPost() {
  // Heartbeat first, before any early return, so the health endpoint can tell a
  // stopped/crashed process (stale heartbeat) apart from a legitimately quiet day.
  health.recordHeartbeat();

  const ptHour = getPtHour();

  // Active hours: 6 AM - 10 PM PT (no posting 11 PM - 5 AM)
  if (ptHour < 6 || ptHour >= 23) {
    return;
  }

  const posted = tracker.load();

  // Enforce minimum gap between posts
  if (posted.lastPostTime) {
    const elapsed = Date.now() - new Date(posted.lastPostTime).getTime();
    if (elapsed < MIN_INTERVAL_MS) {
      const needMin = Math.round(MIN_INTERVAL_MS / 60000);
      log(`[SKIP] ${Math.round(elapsed / 60000)}min since last post, need ${needMin}min`);
      return;
    }
  }

  const daily = tracker.getDailyCounts(posted);
  if ((daily.total || 0) >= DAILY_MAX) {
    log(`[SKIP] Daily limit reached (${daily.total || 0}/${DAILY_MAX})`);
    return;
  }

  // --- Slot 1: new original article (once per day) ---
  if ((daily.originals || 0) < 1) {
    const newArticles = content.getNewOriginals(posted);
    if (newArticles.length > 0) {
      const article = newArticles[0];
      const tweet = formatter.formatOriginalTweet(article);
      const ok = await tryPost(tweet, `original: ${article.slug}`);
      if (ok) {
        tracker.markPosted(posted, article.slug, "articles");
        recordPost(posted, "originals");
      }
      return;
    }
    // No new original today: do not substitute filler, fall through to the news slot.
  }

  // --- Slot 2: notable news headline (once per day, only if it clears the bar) ---
  if ((daily.news || 0) < 1) {
    const headline = await content.getNotableHeadline(posted);
    if (headline) {
      const tweet = formatter.formatRssTweet(headline);
      const hash = tracker.hashUrl(headline.link);
      const ok = await tryPost(tweet, `news: ${headline.source}`);
      if (ok) {
        tracker.markPosted(posted, hash, "rss");
        recordPost(posted, "news");
      }
      return;
    }
  }

  log(`[SKIP] Nothing to post (originals=${daily.originals || 0}, news=${daily.news || 0})`);
}

// Prune old tracking entries daily at midnight PT (7 AM UTC)
cron.schedule("0 7 * * *", () => {
  log("[PRUNE] Cleaning old tracking entries");
  const posted = tracker.load();
  tracker.pruneOldEntries(posted);
});

// Check every hour (min-interval enforced inside checkAndPost)
cron.schedule("0 * * * *", () => {
  checkAndPost().catch((err) => log(`[FATAL] ${err.message}`));
});

// Run on startup
log(`[START] VR.org X bot started (DRY_RUN=${DRY_RUN}, max ${DAILY_MAX}/day)`);
checkAndPost().catch((err) => log(`[FATAL] ${err.message}`));
