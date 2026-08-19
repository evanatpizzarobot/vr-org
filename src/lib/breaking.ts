// "Breaking" treatment for big-news originals. An article flagged in
// data/articles.json with `breaking: true` (renders the label "BREAKING")
// or `breaking: "LEAK"` (any string becomes the label) gets a red outline
// border on its cards, but only while the story is actually fresh: within
// 48 hours of publishDate (parsed as UTC midnight, matching how bare
// publishDate strings parse everywhere else). After the window closes the
// flag stays in the data harmlessly and cards render normally, so nobody
// has to remember to remove it. Use sparingly; the treatment is only
// special while it is rare.
const BREAKING_WINDOW_MS = 48 * 60 * 60 * 1000;

export function breakingLabel(
  breaking: boolean | string | undefined,
  publishDate: string
): string | null {
  if (!breaking) return null;
  const published = new Date(`${publishDate}T00:00:00Z`).getTime();
  if (!Number.isFinite(published)) return null;
  const age = Date.now() - published;
  if (age < 0 || age > BREAKING_WINDOW_MS) return null;
  return typeof breaking === "string" ? breaking.toUpperCase() : "BREAKING";
}
