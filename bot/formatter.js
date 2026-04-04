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

function pickHashtags(category, tags, maxCount = 4) {
  const pool = new Set();
  // Add 1-2 general tags
  const shuffledGeneral = [...GENERAL_TAGS].sort(() => Math.random() - 0.5);
  pool.add(shuffledGeneral[0]);
  if (Math.random() > 0.4) pool.add(shuffledGeneral[1]);

  // Add topic-specific tags
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

function formatOriginalTweet(article) {
  const hashtags = pickHashtags(article.category, article.tags);
  const url = `https://vr.org/articles/${article.slug}`;
  // Budget: headline + \n\n + snippet + \n\n + "Read more: " + url(23) + \n\n + hashtags
  const fixedLen = 2 + 2 + "Read more: ".length + URL_CHAR_COUNT + 2 + hashtags.length;
  const availableForContent = MAX_TWEET - fixedLen;
  const snippetBudget = Math.max(0, availableForContent - 120 - 2);
  const headline = truncate(article.title, Math.min(120, availableForContent));
  const snippet = truncate(article.snippet, snippetBudget);

  const parts = [headline];
  if (snippet && snippetBudget > 30) {
    parts.push("");
    parts.push(snippet);
  }
  parts.push("");
  parts.push(`Read more: ${url}`);
  parts.push("");
  parts.push(hashtags);

  return parts.join("\n");
}

function formatRssTweet(article) {
  const hashtags = pickHashtags(article.category, article.tags);
  const sourceHandle = SOURCE_HANDLES[article.source] || article.sourceName;
  const categoryPath = article.category || "hardware";
  const vrOrgUrl = `https://vr.org/${categoryPath}`;

  // Budget: headline + \n\n + attribution + url(23) + \n\n + hashtags
  const attrLine = `via ${sourceHandle} | More VR news: `;
  const fixedLen = 2 + attrLine.length + URL_CHAR_COUNT + 2 + hashtags.length;
  const headlineBudget = MAX_TWEET - fixedLen;
  const headline = truncate(article.title, Math.min(140, headlineBudget));

  return [headline, "", `${attrLine}${vrOrgUrl}`, "", hashtags].join("\n");
}

function formatEngagementTweet(template) {
  return template;
}

module.exports = { formatOriginalTweet, formatRssTweet, formatEngagementTweet };
