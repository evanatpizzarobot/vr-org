import { test } from "node:test";
import assert from "node:assert/strict";
import { extractYouTubeRefs, titleOverlapsContext } from "../scripts/check-youtube-ids.mjs";

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
