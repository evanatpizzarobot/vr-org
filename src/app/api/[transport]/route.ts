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
import { z } from "zod";
import { startFeedEngine } from "@/lib/rss/engine";
import {
  formatResult,
  searchVrNews,
  getVrTrending,
  listVrOriginals,
  getVrArticle,
  getVrDeals,
  compareVrHeadsets,
  getTopVrGames,
  getTopVrApps,
  listVrSources,
  vrExplain,
} from "@/lib/mcp/tools";

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
          query: z.string().optional().describe("Optional keyword to match in the title or snippet."),
          category: z.string().optional().describe(CATEGORY_DESC),
          limit: z.number().optional().describe("Max results, 1-50 (default 20)."),
        },
        annotations: { ...READ_ONLY, title: "Search VR / AR / XR news" },
      },
      async (args) => formatResult(searchVrNews(args)),
    );

    server.registerTool(
      "get_vr_trending",
      {
        title: "Get trending VR topics",
        description: "Returns the topics currently trending across VR.org's aggregated VR / AR / XR feed.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "Get trending VR topics" },
      },
      async () => formatResult(getVrTrending()),
    );

    server.registerTool(
      "list_vr_originals",
      {
        title: "List VR.org original articles",
        description:
          "Returns summaries of VR.org's own editorial articles (reporting, opinion, retrospectives, guides), newest first. Optionally filter by category.",
        inputSchema: {
          category: z.string().optional().describe(CATEGORY_DESC),
          limit: z.number().optional().describe("Max results, 1-50 (default 15)."),
        },
        annotations: { ...READ_ONLY, title: "List VR.org original articles" },
      },
      async (args) => formatResult(listVrOriginals(args)),
    );

    server.registerTool(
      "get_vr_article",
      {
        title: "Get a VR.org article by slug",
        description:
          "Returns the full content (title, author, date, tags, and the article body HTML) of one VR.org original article identified by its slug.",
        inputSchema: { slug: z.string().describe("The article slug, e.g. 'why-vr-is-the-perfect-horror-machine'.") },
        annotations: { ...READ_ONLY, title: "Get a VR.org article by slug" },
      },
      async (args) => formatResult(getVrArticle(args)),
    );

    server.registerTool(
      "get_vr_deals",
      {
        title: "Get VR product deals and prices",
        description:
          "Returns VR.org's current curated product picks (headsets, accessories, AR glasses) with prices, badges, and retailer links. Optionally filter to one section.",
        inputSchema: { section: z.string().optional().describe("Optional section filter, e.g. 'headsets'.") },
        annotations: { ...READ_ONLY, title: "Get VR product deals and prices" },
      },
      async (args) => formatResult(getVrDeals(args)),
    );

    server.registerTool(
      "compare_vr_headsets",
      {
        title: "Compare two VR headsets",
        description:
          "Returns a side-by-side of two headsets (price, badge, description, retailer links) from VR.org's curated catalog. Accepts partial names like 'Quest 3' or 'PSVR2'.",
        inputSchema: {
          a: z.string().describe("First headset name (partial match allowed)."),
          b: z.string().describe("Second headset name (partial match allowed)."),
        },
        annotations: { ...READ_ONLY, title: "Compare two VR headsets" },
      },
      async (args) => formatResult(compareVrHeadsets(args)),
    );

    server.registerTool(
      "get_top_vr_games",
      {
        title: "Get the top VR games list",
        description: "Returns VR.org's current ranked list of the top VR games.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "Get the top VR games list" },
      },
      async () => formatResult(getTopVrGames()),
    );

    server.registerTool(
      "get_top_vr_apps",
      {
        title: "Get the top VR apps list",
        description: "Returns VR.org's current ranked list of the top VR apps and utilities.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "Get the top VR apps list" },
      },
      async () => formatResult(getTopVrApps()),
    );

    server.registerTool(
      "list_vr_sources",
      {
        title: "List VR.org news sources",
        description: "Returns the news sources VR.org aggregates, with per-source article counts and status.",
        inputSchema: {},
        annotations: { ...READ_ONLY, title: "List VR.org news sources" },
      },
      async () => formatResult(listVrSources()),
    );

    server.registerTool(
      "vr_explain",
      {
        title: "Explain a VR / AR / XR topic",
        description:
          "Returns a canonical VR.org answer and the authoritative pillar-page link for a common VR / AR / XR question (for example 'what is vr', 'best headset', 'ar glasses').",
        inputSchema: { topic: z.string().describe("The topic or question, e.g. 'what is vr' or 'best vr headset'.") },
        annotations: { ...READ_ONLY, title: "Explain a VR / AR / XR topic" },
      },
      async (args) => formatResult(vrExplain(args)),
    );
  },
  {
    serverInfo: { name: "vr-org", version: "1.0.0" },
  },
  { basePath: "/api", maxDuration: 60, verboseLogs: false },
);

export { handler as GET, handler as POST, handler as DELETE };
