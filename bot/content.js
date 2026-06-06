const fs = require("fs");
const path = require("path");
const tracker = require("./tracker");

const DATA_DIR = path.join(__dirname, "..", "data");
const API_BASE = "http://localhost:3000/api";

// A "new" original is one published within this many hours that we have not tweeted yet.
const NEW_ORIGINAL_WINDOW_H = 48;

// A news headline only posts as the optional 2nd tweet if it scores at least this high.
// Scoring (in getRssHeadlines): +3 if under 6h old (else +1), +2 if it matches a trending topic.
// 5 = fresh AND trending (intentionally strict). Lower to 3 to also allow "fresh OR trending"
// if the 2nd slot turns out too quiet.
const NOTABLE_SCORE = 5;

function readJson(filename) {
  try {
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) return null;
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } catch {
    return null;
  }
}

async function fetchApi(endpoint) {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Returns recently-published originals (newest first) that have not been tweeted yet.
// Empty array on a day with nothing new, which keeps the account silent rather than posting filler.
function getNewOriginals(posted) {
  const articles = readJson("articles.json");
  if (!articles) return [];
  const windowStart = Date.now() - NEW_ORIGINAL_WINDOW_H * 60 * 60 * 1000;
  return articles
    .filter((a) => new Date(a.publishDate).getTime() >= windowStart)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .filter((a) => !tracker.wasPostedRecently(posted, a.slug, "articles", 48));
}

async function getRssHeadlines(posted) {
  // Fetch from the live Next.js API (feed data is in-memory, not on disk)
  const feedData = await fetchApi("feed?limit=200");
  const trendingData = await fetchApi("trending");

  if (!feedData || !feedData.articles) return [];

  const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  // Score articles (skip VR.org originals, those go through Tier 1)
  const scored = feedData.articles
    .filter((a) => a.source !== "vrorg")
    .filter((a) => {
      const hash = tracker.hashUrl(a.link);
      return !tracker.wasPostedRecently(posted, hash, "rss", 48);
    })
    .filter((a) => {
      const pubTime = new Date(a.pubDate).getTime();
      return pubTime > twentyFourHoursAgo;
    })
    .map((a) => {
      let score = 0;
      const pubTime = new Date(a.pubDate).getTime();

      // Recency bonus
      if (pubTime > sixHoursAgo) score += 3;
      else score += 1;

      // Trending topic match
      if (trendingData && trendingData.topics) {
        const titleLower = a.title.toLowerCase();
        for (const topic of trendingData.topics) {
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

// Returns the single top-scored headline only if it clears the notability bar, else null.
// This is the gate for the optional 2nd "bigger news worth posting" tweet.
async function getNotableHeadline(posted) {
  const headlines = await getRssHeadlines(posted);
  if (!headlines.length) return null;
  const top = headlines[0];
  return (top.score || 0) >= NOTABLE_SCORE ? top : null;
}

module.exports = { getNewOriginals, getRssHeadlines, getNotableHeadline };
