import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractYouTubeRefs,
  titleOverlapsContext,
  parseRecentFlag,
  parseSlugFlag,
} from "../scripts/check-youtube-ids.mjs";

test("extracts an id from a thumbnail url", () => {
  const body = '<figure><img src="https://img.youtube.com/vi/S83ybX7jQ-c/maxresdefault.jpg" alt="x" /><figcaption>Watch: PAYDAY trailer on YouTube</figcaption></figure>';
  const refs = extractYouTubeRefs(body);
  assert.equal(refs.length, 1);
  assert.equal(refs[0].id, "S83ybX7jQ-c");
  assert.match(refs[0].context, /PAYDAY trailer/);
});

test("extracts an id from a watch link", () => {
  const body = '<a href="https://www.youtube.com/watch?v=KTHr6w9ov1s" target="_blank">trailer</a>';
  const refs = extractYouTubeRefs(body);
  assert.equal(refs.length, 1);
  assert.equal(refs[0].id, "KTHr6w9ov1s");
});

test("deduplicates an id that appears as both link and thumbnail", () => {
  const body =
    '<a href="https://www.youtube.com/watch?v=abc123DEF45"><img src="https://img.youtube.com/vi/abc123DEF45/hqdefault.jpg" /></a>';
  assert.equal(extractYouTubeRefs(body).length, 1);
});

test("returns nothing for a body with no youtube references", () => {
  assert.deepEqual(extractYouTubeRefs("<p>no video here</p>"), []);
});

test("titleOverlapsContext accepts a shared distinctive word", () => {
  assert.equal(
    titleOverlapsContext("Breachers: Outbreak Reveal Trailer", "Watch: Breachers Outbreak reveal on YouTube"),
    true
  );
});

test("titleOverlapsContext rejects a completely unrelated title", () => {
  assert.equal(
    titleOverlapsContext("Cat Compilation 2019", "Watch: Breachers Outbreak reveal on YouTube"),
    false
  );
});

test("titleOverlapsContext ignores short stopwords when judging overlap", () => {
  assert.equal(titleOverlapsContext("The Game And The Show", "the and a of on show"), true);
  // Every word in "The And Of" is either a stopword or under 4 characters, so
  // titleWords is empty and the function short-circuits to true: a title with
  // no distinctive words carries no signal, and this channel is REVIEW-only,
  // so a manufactured flag here would be a false positive, not a catch.
  assert.equal(titleOverlapsContext("The And Of", "the and of"), true);
});

test("titleOverlapsContext no longer treats ambient VR words as a shared signal", () => {
  // Before this fix, "meta" and "quest" both counted as distinctive words and
  // are shared by nearly every VR article, so a wrong-but-real video titled
  // this way silently passed inside any Quest coverage. They are now
  // stopwords: the only remaining word in the title ("unboxing") shares
  // nothing with the context, so the mismatch is correctly flagged instead.
  assert.equal(
    titleOverlapsContext(
      "Meta Quest 3 Official Unboxing",
      "Watch: our hands-on with the new Meta Quest 3 headset on YouTube"
    ),
    false
  );
});

test("extractYouTubeRefs uses the figure's figcaption and alt text as context, not surrounding paragraphs", () => {
  const body =
    '<p>This section is about Batman Arkham Shadow and covers a bunch of unrelated words that used to leak into the old fixed-radius context window.</p>' +
    '<figure><img src="https://img.youtube.com/vi/S83ybX7jQ-c/maxresdefault.jpg" alt="PAYDAY Aces High reveal thumbnail" loading="lazy" /><figcaption>Watch: PAYDAY Aces High reveal trailer on YouTube</figcaption></figure>' +
    '<p>More unrelated trailing paragraph text that should also stay out of the context window.</p>';
  const refs = extractYouTubeRefs(body);
  assert.equal(refs.length, 1);
  assert.doesNotMatch(refs[0].context, /Batman Arkham Shadow/);
  assert.doesNotMatch(refs[0].context, /trailing paragraph/);
  assert.match(refs[0].context, /PAYDAY Aces High/);
});

test("parseRecentFlag accepts the space form", () => {
  const flag = parseRecentFlag(["--recent", "12"]);
  assert.deepEqual(flag, { present: true, valid: true, value: 12, raw: "12" });
});

test("parseRecentFlag accepts the equals form", () => {
  const flag = parseRecentFlag(["--recent=12"]);
  assert.equal(flag.valid, true);
  assert.equal(flag.value, 12);
});

test("parseRecentFlag is invalid when --recent is the trailing argument with no value", () => {
  const flag = parseRecentFlag(["--recent"]);
  assert.equal(flag.present, true);
  assert.equal(flag.valid, false);
});

test("parseRecentFlag is invalid for a non-numeric value in either form", () => {
  assert.equal(parseRecentFlag(["--recent=abc"]).valid, false);
  assert.equal(parseRecentFlag(["--recent", "abc"]).valid, false);
});

test("parseRecentFlag defaults to the whole archive when absent", () => {
  assert.deepEqual(parseRecentFlag([]), { present: false, valid: true, value: 0, raw: null });
});

test("parseSlugFlag accepts both the equals and space forms", () => {
  assert.equal(parseSlugFlag(["--slug=foo"]).value, "foo");
  assert.equal(parseSlugFlag(["--slug", "foo"]).value, "foo");
});

test("parseSlugFlag is invalid when given with no value", () => {
  assert.equal(parseSlugFlag(["--slug"]).valid, false);
});
