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

module.exports = { postTweet };
