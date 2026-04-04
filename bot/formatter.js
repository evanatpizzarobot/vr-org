const SOURCE_HANDLES = {
  roadtovr: "@RoadtoVR",
  uploadvr: "@UploadVR",
  techcrunch: "@TechCrunch",
  xrtoday: "@XRToday",
  mixed: "@MixedNews",
  theverge: "@verge",
  arstechnica: "@arstechnica",
  venturebeat: "@VentureBeat",
};

const GENERAL_TAGS = ["#VR", "#VirtualReality", "#AR", "#AugmentedReality", "#XR", "#SpatialComputing"];

const TOPIC_TAGS = {
  gaming: ["#VRGaming", "#IndieVR", "#GameDev"],
  hardware: ["#MetaQuest", "#SteamFrame", "#PSVR2"],
  software: ["#WebXR", "#VRDev"],
  enterprise: ["#VRTraining", "#EnterpriseXR"],
  ar: ["#SmartGlasses", "#SpatialComputing", "#AugmentedReality"],
  xr: ["#MixedReality", "#AndroidXR", "#XR"],
};

// URLs count as 23 chars on X regardless of actual length
const URL_CHAR_COUNT = 23;
const MAX_TWEET = 280;

function pickHashtags(category, tags, maxCount = 2) {
  const pool = new Set();
  // Add 1 general tag
  const shuffledGeneral = [...GENERAL_TAGS].sort(() => Math.random() - 0.5);
  pool.add(shuffledGeneral[0]);

  // Fill remaining with topic-specific tags
  const topicPool = [];
  if (TOPIC_TAGS[category]) topicPool.push(...TOPIC_TAGS[category]);
  if (tags) {
    for (const t of tags) {
      if (TOPIC_TAGS[t]) topicPool.push(...TOPIC_TAGS[t]);
    }
  }
  const shuffledTopic = [...new Set(topicPool)].sort(() => Math.random() - 0.5);
  for (const tag of shuffledTopic) {
    if (pool.size >= maxCount) break;
    pool.add(tag);
  }

  return [...pool].slice(0, maxCount).join(" ");
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3).trimEnd() + "...";
}

// --- Original tweet formats (randomly varied) ---

function originalDetailed(article) {
  const hashtags = pickHashtags(article.category, article.tags);
  const url = `https://vr.org/articles/${article.slug}`;
  const fixedLen = 2 + 2 + "Read more: ".length + URL_CHAR_COUNT + 2 + hashtags.length;
  const availableForContent = MAX_TWEET - fixedLen;
  const snippetBudget = Math.max(0, availableForContent - 120 - 2);
  const headline = truncate(article.title, Math.min(120, availableForContent));
  const snippet = truncate(article.snippet, snippetBudget);

  const parts = [headline];
  if (snippet && snippetBudget > 30) {
    parts.push("", snippet);
  }
  parts.push("", `Read more: ${url}`, "", hashtags);
  return parts.join("\n");
}

function originalShort(article) {
  const hashtags = pickHashtags(article.category, article.tags);
  const url = `https://vr.org/articles/${article.slug}`;
  const fixedLen = 2 + URL_CHAR_COUNT + 2 + hashtags.length;
  const headline = truncate(article.title, MAX_TWEET - fixedLen);
  return [headline, "", url, "", hashtags].join("\n");
}

function originalHook(article) {
  const url = `https://vr.org/articles/${article.slug}`;
  const prefix = "New on VR.org:";
  const fixedLen = prefix.length + 1 + 2 + URL_CHAR_COUNT;
  const headline = truncate(article.title, MAX_TWEET - fixedLen);
  return [`${prefix} ${headline}`, "", url].join("\n");
}

function formatOriginalTweet(article) {
  const roll = Math.random();
  if (roll < 0.5) return originalDetailed(article);
  if (roll < 0.8) return originalShort(article);
  return originalHook(article);
}

// --- RSS tweet formats (randomly varied) ---

function rssAttribution(article) {
  const hashtags = pickHashtags(article.category, article.tags);
  const sourceHandle = SOURCE_HANDLES[article.source] || article.sourceName;
  const categoryPath = article.category || "hardware";
  const vrOrgUrl = `https://vr.org/${categoryPath}`;
  const attrLine = `via ${sourceHandle} | More VR news: `;
  const fixedLen = 2 + attrLine.length + URL_CHAR_COUNT + 2 + hashtags.length;
  const headline = truncate(article.title, Math.min(140, MAX_TWEET - fixedLen));
  return [headline, "", `${attrLine}${vrOrgUrl}`, "", hashtags].join("\n");
}

function rssClean(article) {
  const hashtags = pickHashtags(article.category, article.tags);
  const sourceHandle = SOURCE_HANDLES[article.source] || article.sourceName;
  const categoryPath = article.category || "hardware";
  const vrOrgUrl = `https://vr.org/${categoryPath}`;
  const suffix = ` (${sourceHandle})`;
  const fixedLen = suffix.length + 2 + URL_CHAR_COUNT + 2 + hashtags.length;
  const headline = truncate(article.title, Math.min(140, MAX_TWEET - fixedLen));
  return [headline + suffix, "", vrOrgUrl, "", hashtags].join("\n");
}

function formatRssTweet(article) {
  return Math.random() < 0.5 ? rssAttribution(article) : rssClean(article);
}

function formatEngagementTweet(template) {
  return template;
}

module.exports = { formatOriginalTweet, formatRssTweet, formatEngagementTweet };
