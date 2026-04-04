const fs = require("fs");
const path = require("path");
const tracker = require("./tracker");

const DATA_DIR = path.join(__dirname, "..", "data");

function readJson(filename) {
  try {
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) return null;
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } catch {
    return null;
  }
}

// Engagement post templates (rotated)
const ENGAGEMENT_TEMPLATES = [
  "What VR game are you playing this week? Drop your picks below.",
  "Quest 3, PSVR 2, or waiting for Steam Frame? Where are you playing VR right now?",
  "What's the one VR game you'd recommend to someone who just got a headset?",
  "Unpopular opinion time: what's an overrated VR game? (Don't say Beat Saber, that's too easy.)",
  "If you could only play one VR game for the rest of the year, what would it be?",
  "VR fitness players: what's your go-to workout game?",
  "What VR feature do you wish existed but doesn't yet?",
  "Best VR game you played in the last month? Go.",
  "Would you rather have perfect eye tracking or full body tracking in VR?",
  "Hot take: standalone VR will always be limited. Agree or disagree?",
];

function getNewOriginals(posted) {
  const articles = readJson("articles.json");
  if (!articles) return [];
  return articles
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .filter((a) => !tracker.wasPostedRecently(posted, a.slug, "articles", 48));
}

function getRotationOriginal(posted) {
  const articles = readJson("articles.json");
  if (!articles) return null;
  // Pick the oldest-posted (or never-posted) article not tweeted in the last 7 days
  const candidates = articles.filter(
    (a) => !tracker.wasPostedRecently(posted, a.slug, "articles", 168)
  );
  if (candidates.length === 0) return null;
  // Pick randomly from candidates for variety
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getRssHeadlines(posted) {
  const feed = readJson("feed.json");
  if (!feed || !feed.articles) return [];

  const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  // Score articles
  const scored = feed.articles
    .filter((a) => {
      const hash = tracker.hashUrl(a.link);
      return !tracker.wasPostedRecently(posted, hash, "rss", 48);
    })
    .filter((a) => {
      // Only consider articles from the last 24 hours
      const pubTime = new Date(a.pubDate).getTime();
      return pubTime > twentyFourHoursAgo;
    })
    .map((a) => {
      let score = 0;
      const pubTime = new Date(a.pubDate).getTime();

      // Recency bonus
      if (pubTime > sixHoursAgo) score += 3;
      else score += 1;

      // Source diversity (will be applied at selection time)
      // Trending topic match
      const trending = readJson("trending.json");
      if (trending && trending.topics) {
        const titleLower = a.title.toLowerCase();
        for (const topic of trending.topics) {
          if (titleLower.includes(topic.topic.toLowerCase())) {
            score += 2;
            break;
          }
        }
      }

      return { ...a, score };
    })
    .sort((a, b) => b.score - a.score);

  // Apply source diversity: no more than 2 from the same source in a batch
  const selected = [];
  const sourceCounts = {};
  for (const article of scored) {
    const src = article.source || "unknown";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    if (sourceCounts[src] <= 2) {
      selected.push(article);
    }
    if (selected.length >= 20) break;
  }

  return selected;
}

function getEngagementPost(posted) {
  const lastTime = posted.lastEngagementPost
    ? new Date(posted.lastEngagementPost).getTime()
    : 0;
  const hoursSince = (Date.now() - lastTime) / (1000 * 60 * 60);

  // Only allow one engagement post per 12 hours
  if (hoursSince < 12) return null;

  const idx = Math.floor(Math.random() * ENGAGEMENT_TEMPLATES.length);
  return ENGAGEMENT_TEMPLATES[idx];
}

module.exports = { getNewOriginals, getRotationOriginal, getRssHeadlines, getEngagementPost };
