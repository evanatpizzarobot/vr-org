import type { Article, TrendingTopic } from "./types";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "it", "its", "this", "that", "are",
  "was", "be", "has", "had", "have", "will", "can", "could", "may",
  "might", "would", "should", "do", "does", "did", "not", "no", "so",
  "if", "up", "out", "just", "about", "more", "than", "how", "what",
  "when", "where", "who", "which", "all", "been", "being", "into",
  "over", "after", "before", "new", "now", "says", "said", "set",
  "get", "gets", "got", "via", "also", "still", "first", "why",
  "here", "his", "her", "their", "they", "them", "we", "our", "you",
  "your", "he", "she", "as", "i", "my", "me", "us",
]);

function extractPhrases(title: string): string[] {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  const phrases: string[] = [];

  // Single significant words
  for (const word of words) {
    if (word.length >= 3) {
      phrases.push(word);
    }
  }

  // Bigrams
  for (let i = 0; i < words.length - 1; i++) {
    if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }
  }

  return phrases;
}

export function computeTrending(articles: Article[]): TrendingTopic[] {
  // Only consider articles from last 48 hours
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = articles.filter((a) => new Date(a.pubDate).getTime() > cutoff);

  const phraseCounts = new Map<string, { count: number; sources: Set<string> }>();

  for (const article of recent) {
    const phrases = extractPhrases(article.title);
    for (const phrase of phrases) {
      const existing = phraseCounts.get(phrase) || { count: 0, sources: new Set() };
      existing.count++;
      existing.sources.add(article.source);
      phraseCounts.set(phrase, existing);
    }
  }

  // Score: count * (1 + cross-source bonus)
  const scored: { topic: string; count: number; sources: number; score: number }[] = [];

  for (const [topic, data] of phraseCounts) {
    // Skip single-word topics with low counts
    if (!topic.includes(" ") && data.count < 3) continue;

    const crossSourceBonus = data.sources.size > 1 ? data.sources.size * 0.5 : 0;
    const score = data.count * (1 + crossSourceBonus);

    scored.push({
      topic: topic
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      count: data.count,
      sources: data.sources.size,
      score,
    });
  }

  // Sort by score, take top 10
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 10).map(({ topic, count, sources }) => ({ topic, count, sources }));
}
