// Remote MCP endpoint for VR.org.
//
// Serves the same VR/AR/XR tools as the published npm server (vr-org-mcp) over
// MCP's streamable-HTTP transport, so ChatGPT connectors and Claude.ai web
// connectors can use VR.org with no local install. Reachable at:
//   https://vr.org/api/mcp   (canonical)
//   https://vr.org/mcp       (rewrite, see next.config.ts)
//
// Read-only. No keys, no writes. mcp-handler runs stateless (no Redis).

import { createMcpHandler } from "mcp-handler";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { startFeedEngine } from "@/lib/rss/engine";
import {
  safeResult,
  searchVrNews,
  getVrTrending,
  listVrOriginals,
  getVrArticle,
  getVrEvents,
  getVrDeals,
  compareVrHeadsets,
  getTopVrGames,
  getTopVrApps,
  listVrSources,
  vrExplain,
} from "@/lib/mcp/tools";
import {
  newsLatestResource,
  originalsLatestResource,
  eventsUpcomingResource,
  guidesResource,
  articleResource,
  articleList,
} from "@/lib/mcp/resources";
import {
  recommendHeadsetPrompt,
  thisWeekInVrPrompt,
  explainVrTopicPrompt,
} from "@/lib/mcp/prompts";
import { classifyUa, recordRequest, recordToolCall } from "@/lib/mcp/stats";

function resContents(uri: string, mimeType: string, text: string) {
  return { contents: [{ uri, mimeType, text }] };
}

// Resource text producers read the same local data as the tools and could throw
// (missing file, malformed JSON). Degrade to a short notice rather than letting a
// raw error reach the client, mirroring the npm server's resource read guard.
function safeText(produce: () => string): string {
  try {
    return produce();
  } catch {
    return "VR.org resource is temporarily unavailable. Retry shortly.";
  }
}

// Counts the tool call, then runs the normal guarded tool path. Stats never
// throw (guarded inside the stats module), so tool behavior is unchanged.
function withStats(tool: string, fn: Parameters<typeof safeResult>[0]) {
  recordToolCall(tool);
  return safeResult(fn);
}

// Make sure the in-memory RSS engine is running so the feed tools have data.
startFeedEngine();

const CATEGORY_DESC =
  "Optional category filter: hardware, gaming, software, enterprise, ar, or xr. Omit for all.";

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, openWorldHint: true } as const;

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "search_vr_news",
      {
        title: "Search VR / AR / XR news",
        description:
          "Returns the latest VR, AR, and XR headlines from VR.org's live aggregated feed plus VR.org originals. Optionally filter by category and match a keyword.",
        inputSchema: {
          query: z.string().max(500).optional().describe("Optional keyword to match in the title or snippet."),
          category: z.string().max(100).optional().describe(CATEGORY_DESC),
          limit: z.number().optional().describe("Max results, 1-50 (default 20)."),
        },
        annotations: { ...READ_ONLY, title: "Search VR / AR / XR news" },
      },
      async (args) => withStats("search_vr_news", () => searchVrNews(args)),
    );

    server.registerTool(
      "get_vr_trending",
      {
        title: "Get trending VR topics",
        description: "Returns the topics currently trending across VR.org's aggregated VR / AR / XR feed.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "Get trending VR topics" },
      },
      async () => withStats("get_vr_trending", () => getVrTrending()),
    );

    server.registerTool(
      "list_vr_originals",
      {
        title: "List VR.org original articles",
        description:
          "Returns summaries of VR.org's own editorial articles (reporting, opinion, retrospectives, guides), newest first. Optionally filter by category.",
        inputSchema: {
          category: z.string().max(100).optional().describe(CATEGORY_DESC),
          limit: z.number().optional().describe("Max results, 1-50 (default 15)."),
        },
        annotations: { ...READ_ONLY, title: "List VR.org original articles" },
      },
      async (args) => withStats("list_vr_originals", () => listVrOriginals(args)),
    );

    server.registerTool(
      "get_vr_article",
      {
        title: "Get a VR.org article by slug",
        description:
          "Returns the full content (title, author, date, tags, and the article body HTML) of one VR.org original article identified by its slug.",
        inputSchema: { slug: z.string().max(200).describe("The article slug, e.g. 'why-vr-is-the-perfect-horror-machine'.") },
        annotations: { ...READ_ONLY, title: "Get a VR.org article by slug" },
      },
      async (args) => withStats("get_vr_article", () => getVrArticle(args)),
    );

    server.registerTool(
      "get_vr_events",
      {
        title: "Get upcoming VR / AR / XR events",
        description:
          "Returns upcoming VR, AR, and XR industry events (conferences, expos, launches) from VR.org's events calendar, soonest first. Set include_past to also include events that have already ended.",
        inputSchema: {
          limit: z.number().optional().describe("Max results, 1-50 (default 10)."),
          include_past: z
            .boolean()
            .optional()
            .describe("Include events that have already ended (default false)."),
        },
        annotations: { ...READ_ONLY, title: "Get upcoming VR / AR / XR events" },
      },
      async (args) =>
        withStats("get_vr_events", () => getVrEvents({ limit: args.limit, includePast: args.include_past })),
    );

    server.registerTool(
      "get_vr_deals",
      {
        title: "Get VR product deals and prices",
        description:
          "Returns VR.org's current curated product picks (headsets, accessories, AR glasses) with prices, badges, and retailer links. Optionally filter to one section.",
        inputSchema: { section: z.string().max(200).optional().describe("Optional section filter, e.g. 'headsets'.") },
        annotations: { ...READ_ONLY, title: "Get VR product deals and prices" },
      },
      async (args) => withStats("get_vr_deals", () => getVrDeals(args)),
    );

    server.registerTool(
      "compare_vr_headsets",
      {
        title: "Compare two VR headsets",
        description:
          "Returns a side-by-side of two headsets (price, badge, description, retailer links) from VR.org's curated catalog. Accepts partial names like 'Quest 3' or 'PSVR2'.",
        inputSchema: {
          a: z.string().max(200).describe("First headset name (partial match allowed)."),
          b: z.string().max(200).describe("Second headset name (partial match allowed)."),
        },
        annotations: { ...READ_ONLY, title: "Compare two VR headsets" },
      },
      async (args) => withStats("compare_vr_headsets", () => compareVrHeadsets(args)),
    );

    server.registerTool(
      "get_top_vr_games",
      {
        title: "Get the top VR games list",
        description: "Returns VR.org's current ranked list of the top VR games.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "Get the top VR games list" },
      },
      async () => withStats("get_top_vr_games", () => getTopVrGames()),
    );

    server.registerTool(
      "get_top_vr_apps",
      {
        title: "Get the top VR apps list",
        description: "Returns VR.org's current ranked list of the top VR apps and utilities.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "Get the top VR apps list" },
      },
      async () => withStats("get_top_vr_apps", () => getTopVrApps()),
    );

    server.registerTool(
      "list_vr_sources",
      {
        title: "List VR.org news sources",
        description: "Returns the news sources VR.org aggregates, with per-source article counts and status.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "List VR.org news sources" },
      },
      async () => withStats("list_vr_sources", () => listVrSources()),
    );

    server.registerTool(
      "vr_explain",
      {
        title: "Explain a VR / AR / XR topic",
        description:
          "Returns a canonical VR.org answer and the authoritative pillar-page link for a common VR / AR / XR question (for example 'what is vr', 'best headset', 'ar glasses').",
        inputSchema: { topic: z.string().max(500).describe("The topic or question, e.g. 'what is vr' or 'best vr headset'.") },
        annotations: { ...READ_ONLY, title: "Explain a VR / AR / XR topic" },
      },
      async (args) => withStats("vr_explain", () => vrExplain(args)),
    );

    // ---- Resources: browsable VR.org content the host can attach ----
    server.registerResource(
      "vr-news-latest",
      "vrorg://news/latest",
      {
        title: "Latest VR / AR / XR headlines",
        description: "Live aggregated VR, AR, and XR headlines from VR.org, as a markdown list.",
        mimeType: "text/markdown",
      },
      async (uri) => resContents(uri.href, "text/markdown", safeText(newsLatestResource)),
    );

    server.registerResource(
      "vr-originals-latest",
      "vrorg://originals/latest",
      {
        title: "Latest VR.org original articles",
        description: "Index of VR.org's newest original articles with links and snippets.",
        mimeType: "text/markdown",
      },
      async (uri) => resContents(uri.href, "text/markdown", safeText(originalsLatestResource)),
    );

    server.registerResource(
      "vr-events-upcoming",
      "vrorg://events/upcoming",
      {
        title: "Upcoming VR / AR / XR events",
        description: "VR.org's calendar of upcoming VR, AR, and XR industry events, soonest first.",
        mimeType: "text/markdown",
      },
      async (uri) => resContents(uri.href, "text/markdown", safeText(eventsUpcomingResource)),
    );

    server.registerResource(
      "vr-guides",
      "vrorg://guides",
      {
        title: "VR.org guides: canonical answers",
        description: "VR.org's short authoritative answers to common VR / AR / XR questions, with guide links.",
        mimeType: "text/markdown",
      },
      async (uri) => resContents(uri.href, "text/markdown", safeText(guidesResource)),
    );

    server.registerResource(
      "vr-article",
      new ResourceTemplate("vrorg://article/{slug}", {
        list: async () => ({
          resources: articleList().map((it) => ({
            uri: `vrorg://article/${it.slug}`,
            name: it.slug,
            title: it.title,
            mimeType: "text/html",
          })),
        }),
      }),
      {
        title: "VR.org article (full text)",
        description: "Full HTML body of any VR.org original article, addressed by its slug.",
        mimeType: "text/html",
      },
      async (uri, variables) => {
        const slugVar = variables.slug;
        const slug = Array.isArray(slugVar) ? slugVar[0] ?? "" : String(slugVar ?? "");
        return resContents(uri.href, "text/html", safeText(() => articleResource(slug)));
      },
    );

    // ---- Prompts: templates that steer the model to use the tools/resources ----
    server.registerPrompt(
      "recommend_a_headset",
      {
        title: "Recommend a VR headset",
        description: "Recommend a headset from VR.org's current picks, grounded in live deals and the buyer guide.",
        argsSchema: {
          budget: z.string().max(200).optional().describe("Your budget, e.g. '$400' or 'under $1000'."),
          use_case: z.string().max(200).optional().describe("Main use, e.g. 'PC VR gaming', 'fitness', 'movies'."),
        },
      },
      ({ budget, use_case }) => ({
        messages: [{ role: "user", content: { type: "text", text: recommendHeadsetPrompt({ budget, use_case }) } }],
      }),
    );

    server.registerPrompt(
      "this_week_in_vr",
      {
        title: "This Week in VR",
        description: "Draft a concise weekly VR / AR / XR roundup from VR.org's news and originals.",
        argsSchema: { category: z.string().max(100).optional().describe(CATEGORY_DESC) },
      },
      ({ category }) => ({
        messages: [{ role: "user", content: { type: "text", text: thisWeekInVrPrompt({ category }) } }],
      }),
    );

    server.registerPrompt(
      "explain_vr_topic",
      {
        title: "Explain a VR / AR / XR topic",
        description: "Explain a VR topic for a newcomer, grounded in VR.org's canonical answer and pillar page.",
        argsSchema: { topic: z.string().max(500).describe("The topic, e.g. 'what is vr' or 'passthrough'.") },
      },
      ({ topic }) => ({
        messages: [{ role: "user", content: { type: "text", text: explainVrTopicPrompt({ topic }) } }],
      }),
    );
  },
  {
    serverInfo: { name: "vr-org", version: "1.0.0" },
  },
  { basePath: "/api", maxDuration: 60, verboseLogs: false },
);

// Count each request's client class (from the UA) before handing to mcp-handler.
const tracked = (req: Request) => {
  recordRequest(classifyUa(req.headers.get("user-agent")));
  return handler(req);
};

export { tracked as GET, tracked as POST, tracked as DELETE };
