const { TwitterApi } = require("twitter-api-v2");

let client = null;

function getClient() {
  if (!client) {
    const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } =
      process.env;
    if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
      throw new Error("Missing X API credentials in environment variables");
    }
    client = new TwitterApi({
      appKey: X_API_KEY,
      appSecret: X_API_SECRET,
      accessToken: X_ACCESS_TOKEN,
      accessSecret: X_ACCESS_SECRET,
    });
  }
  return client;
}

async function postTweet(text) {
  const api = getClient();
  const result = await api.v2.tweet(text);
  return result.data;
}

// Cached for the life of the process. The bot runs long-lived under PM2, so this is one
// extra API call per restart rather than one per posting cycle.
let selfUserId = null;

async function getOwnUserId() {
  if (!selfUserId) {
    const me = await getClient().v2.me();
    selfUserId = me.data.id;
  }
  return selfUserId;
}

// Recent tweets from our own account, including ones posted by hand rather than by this bot.
// Requests entities so we can read the real destination of each t.co link.
async function getOwnRecentTweets({ maxResults = 50 } = {}) {
  const api = getClient();
  const userId = await getOwnUserId();
  const res = await api.v2.userTimeline(userId, {
    max_results: maxResults,
    // note_tweet is required: long posts truncate `text` at 280 chars and omit top-level
    // `entities`, so without it a shared link past that cutoff is invisible.
    "tweet.fields": "created_at,entities,note_tweet",
  });
  return (res.data && res.data.data) || [];
}

module.exports = { postTweet, getOwnRecentTweets, getOwnUserId };
