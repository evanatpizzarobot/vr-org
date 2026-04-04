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

function log(msg) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n");
}

// PT hour slots mapped to post type
// 6-7: rss, 8: original, 9-11: rss, 12: rss, 13: engagement,
// 14: rss, 15: original-rotation, 16-17: rss, 18-19: rss, 20: original/engagement
function getPostType(ptHour) {
  if (ptHour === 8) return "original";
  if (ptHour === 15) return "rotation";
  if (ptHour === 13) return "engagement";
  if (ptHour === 20) return Math.random() > 0.5 ? "rotation" : "engagement";
  return "rss";
}

function getPtHour() {
  // Convert current UTC time to PT (UTC-7 PDT / UTC-8 PST)
  // Use a rough PDT offset; precise DST handling not critical for a bot
  const now = new Date();
  const utcHour = now.getUTCHours();
  const ptHour = (utcHour - 7 + 24) % 24;
  return ptHour;
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

async function checkAndPost() {
  const ptHour = getPtHour();
  // Only post during active hours (6 AM - 9 PM PT)
  if (ptHour < 6 || ptHour > 20) {
    return;
  }

  const posted = tracker.load();
  const postType = getPostType(ptHour);

  log(`[CHECK] PT hour=${ptHour}, type=${postType}`);

  if (postType === "original") {
    const newArticles = content.getNewOriginals(posted);
    if (newArticles.length > 0) {
      const article = newArticles[0];
      const tweet = formatter.formatOriginalTweet(article);
      const ok = await tryPost(tweet, `original: ${article.slug}`);
      if (ok) tracker.markPosted(posted, article.slug, "articles");
      return;
    }
    // Fall through to rotation if no new articles
    log("[INFO] No new originals, trying rotation");
  }

  if (postType === "original" || postType === "rotation") {
    const article = content.getRotationOriginal(posted);
    if (article) {
      const tweet = formatter.formatOriginalTweet(article);
      const ok = await tryPost(tweet, `rotation: ${article.slug}`);
      if (ok) tracker.markPosted(posted, article.slug, "articles");
      return;
    }
    log("[INFO] No rotation candidates, falling back to RSS");
  }

  if (postType === "engagement") {
    const template = content.getEngagementPost(posted);
    if (template) {
      const tweet = formatter.formatEngagementTweet(template);
      const ok = await tryPost(tweet, "engagement");
      if (ok) {
        posted.lastEngagementPost = new Date().toISOString();
        tracker.save(posted);
      }
      return;
    }
    log("[INFO] Engagement cooldown active, falling back to RSS");
  }

  // Default: RSS headline
  const headlines = content.getRssHeadlines(posted);
  if (headlines.length > 0) {
    const article = headlines[0];
    const tweet = formatter.formatRssTweet(article);
    const hash = tracker.hashUrl(article.link);
    const ok = await tryPost(tweet, `rss: ${article.source}`);
    if (ok) tracker.markPosted(posted, hash, "rss");
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

// Run every hour on the hour
cron.schedule("0 * * * *", () => {
  checkAndPost().catch((err) => log(`[FATAL] ${err.message}`));
});

// Run on startup
log(`[START] VR.org X bot started (DRY_RUN=${DRY_RUN})`);
checkAndPost().catch((err) => log(`[FATAL] ${err.message}`));
