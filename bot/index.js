require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const { postTweet } = require("./twitter");
const content = require("./content");
const formatter = require("./formatter");
const tracker = require("./tracker");

const LOG_PATH = path.join(__dirname, "bot.log");
const DRY_RUN = process.env.DRY_RUN === "true";

// --- Posting limits ---
const RAMP_UP_START = "2026-04-04";
const RAMP_UP_DAYS = 7;
const RAMP_UP_MAX = 3;
const NORMAL_MAX = 3;
const MIN_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours between posts

const TYPE_LIMITS = {
  originals: 1, // includes new + rotation
  rss: 2,
  engagement: 1,
};

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

function getDailyMax() {
  const start = new Date(RAMP_UP_START).getTime();
  const daysSince = (Date.now() - start) / (1000 * 60 * 60 * 24);
  return daysSince < RAMP_UP_DAYS ? RAMP_UP_MAX : NORMAL_MAX;
}

// Post type selection based on PT hour and remaining daily budget
function getPostType(ptHour, daily) {
  // Morning: try new originals
  if (ptHour >= 7 && ptHour <= 9 && daily.originals < TYPE_LIMITS.originals) {
    return "original";
  }
  // Afternoon: try rotating older originals
  if (ptHour >= 14 && ptHour <= 16 && daily.originals < TYPE_LIMITS.originals) {
    return "rotation";
  }
  // Midday or evening: engagement posts
  if ((ptHour === 12 || ptHour === 19) && daily.engagement < TYPE_LIMITS.engagement) {
    return "engagement";
  }
  // Default: RSS headlines
  if (daily.rss < TYPE_LIMITS.rss) {
    return "rss";
  }
  return null;
}

async function tryPost(text, label) {
  if (DRY_RUN) {
    log(`[DRY RUN] Would post (${label}):\n${text}\n---`);
    return true;
  }
  try {
    const result = await postTweet(text);
    log(`[POSTED] (${label}) id=${result.id}`);
    return true;
  } catch (err) {
    if (err.code === 429 || err.rateLimit) {
      log(`[RATE LIMITED] Will retry next cycle. ${err.message}`);
    } else {
      log(`[ERROR] Failed to post (${label}): ${err.message}`);
    }
    return false;
  }
}

function recordPost(posted, type) {
  tracker.incrementDailyCount(posted, type);
  posted.lastPostTime = new Date().toISOString();
  tracker.save(posted);
}

async function checkAndPost() {
  const ptHour = getPtHour();

  // Active hours: 6 AM - 10 PM PT (no posting 11 PM - 5 AM)
  if (ptHour < 6 || ptHour >= 23) {
    return;
  }

  const posted = tracker.load();

  // Enforce 90-minute minimum gap between posts
  if (posted.lastPostTime) {
    const elapsed = Date.now() - new Date(posted.lastPostTime).getTime();
    if (elapsed < MIN_INTERVAL_MS) {
      log(`[SKIP] ${Math.round(elapsed / 60000)}min since last post, need 90min`);
      return;
    }
  }

  // Check daily post limit (ramp-up aware)
  const daily = tracker.getDailyCounts(posted);
  const maxToday = getDailyMax();
  if (daily.total >= maxToday) {
    log(`[SKIP] Daily limit reached (${daily.total}/${maxToday})`);
    return;
  }

  const postType = getPostType(ptHour, daily);
  if (!postType) {
    log(`[SKIP] All type limits reached for today`);
    return;
  }

  log(`[CHECK] PT hour=${ptHour}, type=${postType}, daily=${daily.total}/${maxToday}`);

  // --- Original (new article) ---
  if (postType === "original") {
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
    log("[INFO] No new originals, trying rotation");
  }

  // --- Rotation (older original) ---
  if (postType === "original" || postType === "rotation") {
    const article = content.getRotationOriginal(posted);
    if (article) {
      const tweet = formatter.formatOriginalTweet(article);
      const ok = await tryPost(tweet, `rotation: ${article.slug}`);
      if (ok) {
        tracker.markPosted(posted, article.slug, "articles");
        recordPost(posted, "originals");
      }
      return;
    }
    log("[INFO] No rotation candidates, falling back to RSS");
  }

  // --- Engagement ---
  if (postType === "engagement") {
    const template = content.getEngagementPost(posted);
    if (template) {
      const tweet = formatter.formatEngagementTweet(template);
      const ok = await tryPost(tweet, "engagement");
      if (ok) {
        posted.lastEngagementPost = new Date().toISOString();
        recordPost(posted, "engagement");
      }
      return;
    }
    log("[INFO] Engagement cooldown active, falling back to RSS");
  }

  // --- RSS headline (default fallback) ---
  if (daily.rss >= TYPE_LIMITS.rss) {
    log("[SKIP] RSS daily limit reached");
    return;
  }
  const headlines = await content.getRssHeadlines(posted);
  if (headlines.length > 0) {
    const article = headlines[0];
    const tweet = formatter.formatRssTweet(article);
    const hash = tracker.hashUrl(article.link);
    const ok = await tryPost(tweet, `rss: ${article.source}`);
    if (ok) {
      tracker.markPosted(posted, hash, "rss");
      recordPost(posted, "rss");
    }
  } else {
    log("[INFO] No RSS headlines available to post");
  }
}

// Prune old tracking entries daily at midnight PT (7 AM UTC)
cron.schedule("0 7 * * *", () => {
  log("[PRUNE] Cleaning old tracking entries");
  const posted = tracker.load();
  tracker.pruneOldEntries(posted);
});

// Check every hour (90-min gap enforced inside checkAndPost)
cron.schedule("0 * * * *", () => {
  checkAndPost().catch((err) => log(`[FATAL] ${err.message}`));
});

// Run on startup
log(`[START] VR.org X bot started (DRY_RUN=${DRY_RUN})`);
checkAndPost().catch((err) => log(`[FATAL] ${err.message}`));
