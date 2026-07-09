import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Connect AI Agents to VR.org: Free MCP Server Setup | VR.org",
  description:
    "Connect Claude, ChatGPT, Cursor, or any MCP client to VR.org's free read-only MCP server: live VR, AR, and XR news, full-text articles, events, deals, and headset comparisons.",
  openGraph: {
    title: "Connect AI Agents to VR.org: Free MCP Server Setup | VR.org",
    description:
      "VR.org runs a free MCP server. Plug Claude, ChatGPT, or Cursor into live VR, AR, and XR news and data.",
    url: "https://vr.org/connect",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect AI Agents to VR.org | VR.org",
    description:
      "Free MCP server: live VR, AR, and XR news and data for AI agents.",
  },
  alternates: {
    canonical: "https://vr.org/connect",
  },
};

const techArticleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Connect AI Agents to VR.org over MCP",
  datePublished: "2026-07-08",
  dateModified: "2026-07-08",
  author: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
  },
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
    logo: {
      "@type": "ImageObject",
      url: "https://vr.org/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://vr.org/connect",
  },
  image: "https://vr.org/og-image.png",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Connect", url: "https://vr.org/connect" },
]);

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="text-[13px] leading-[1.6] rounded-lg p-4 mb-6 overflow-x-auto font-mono"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="font-display text-2xl font-semibold mb-4 mt-10">
      {children}
    </h2>
  );
}

const P_CLASS = "text-[15px] leading-[1.7] mb-4";
const P_STYLE = { color: "var(--text-secondary)" } as const;

export default function ConnectPage() {
  return (
    <>
      <StructuredData data={techArticleSchema} />
      <StructuredData data={breadcrumbs} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Connect AI Agents to VR.org
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          Last updated: July 2026
        </p>

        <p className={P_CLASS} style={P_STYLE}>
          VR.org runs a free, read-only{" "}
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-cyan)" }}
          >
            Model Context Protocol
          </a>{" "}
          server. Instead of relying on whatever an AI model half-remembers
          from training, your assistant can query VR.org directly: the live
          VR, AR, and XR news feed, full-text original articles, the events
          calendar, curated headset deals, side-by-side headset comparisons,
          and buyer-guide answers. No API key, no account, no cost.
        </p>

        <p className={P_CLASS} style={P_STYLE}>
          The hosted endpoint works with every major MCP client:
        </p>
        <CodeBlock>https://vr.org/mcp</CodeBlock>

        <SectionHeading>Claude.ai (web, no install)</SectionHeading>
        <p className={P_CLASS} style={P_STYLE}>
          Open Settings, then Connectors, then Add custom connector, and
          paste the endpoint URL above. Claude can then search VR news, pull
          full articles, and compare headsets mid-conversation.
        </p>

        <SectionHeading>Claude Desktop</SectionHeading>
        <p className={P_CLASS} style={P_STYLE}>
          One click: download the{" "}
          <a
            href="https://github.com/evanatpizzarobot/vr-org-mcp/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-cyan)" }}
          >
            .mcpb bundle
          </a>{" "}
          and double-click it. Or add the server to your{" "}
          <span className="font-mono text-[13px]">
            claude_desktop_config.json
          </span>
          :
        </p>
        <CodeBlock>{`{
  "mcpServers": {
    "vr-org": {
      "command": "npx",
      "args": ["-y", "vr-org-mcp"]
    }
  }
}`}</CodeBlock>

        <SectionHeading>Claude Code</SectionHeading>
        <CodeBlock>{`claude mcp add vr-org -- npx -y vr-org-mcp`}</CodeBlock>

        <SectionHeading>ChatGPT</SectionHeading>
        <p className={P_CLASS} style={P_STYLE}>
          In Settings, enable Developer mode under Connectors, choose Add
          connector, and paste the endpoint URL. The server is read-only, so
          it is safe to approve for automatic use.
        </p>

        <SectionHeading>Cursor</SectionHeading>
        <p className={P_CLASS} style={P_STYLE}>
          Add to <span className="font-mono text-[13px]">.cursor/mcp.json</span>:
        </p>
        <CodeBlock>{`{
  "mcpServers": {
    "vr-org": {
      "command": "npx",
      "args": ["-y", "vr-org-mcp"]
    }
  }
}`}</CodeBlock>

        <SectionHeading>Everything else</SectionHeading>
        <p className={P_CLASS} style={P_STYLE}>
          Any MCP client that speaks streamable HTTP can use{" "}
          <span className="font-mono text-[13px]">https://vr.org/mcp</span>{" "}
          directly, and any client that runs local stdio servers can use{" "}
          <span className="font-mono text-[13px]">npx -y vr-org-mcp</span>.
          The server is published on the official MCP Registry as{" "}
          <span className="font-mono text-[13px]">org.vr/vr-mcp</span>.
        </p>

        <SectionHeading>What your agent gets</SectionHeading>
        <p className={P_CLASS} style={P_STYLE}>
          Eleven tools, five browsable resources, and three prompts, all
          read-only:
        </p>
        <ul
          className="text-[15px] leading-[1.8] mb-6 pl-5 list-disc"
          style={P_STYLE}
        >
          <li>
            <strong style={{ color: "var(--text-primary)" }}>
              search_vr_news
            </strong>
            : the live aggregated VR / AR / XR feed, filterable by category
            and keyword
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>
              get_vr_article
            </strong>
            : full text of any VR.org original article
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>
              compare_vr_headsets
            </strong>
            : side-by-side of any two headsets in our catalog
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>
              get_vr_deals
            </strong>
            : current curated product picks with prices and links
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>
              get_vr_events
            </strong>
            : the VR / AR / XR industry events calendar
          </li>
          <li>
            Plus trending topics, originals index, top games, top apps,
            source list, and canonical explainers
          </li>
        </ul>

        <SectionHeading>Privacy and safety</SectionHeading>
        <p className={P_CLASS} style={P_STYLE}>
          The server is read-only and holds no credentials. It exposes only
          content that is already public on vr.org. Outputs are sanitized
          and size-capped. Usage is measured as aggregate counts only: no
          IPs, no conversation content, nothing personal. Details in the{" "}
          <a
            href="https://github.com/evanatpizzarobot/vr-org-mcp"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-cyan)" }}
          >
            open-source repository
          </a>{" "}
          and our{" "}
          <a href="/privacy" style={{ color: "var(--accent-cyan)" }}>
            privacy policy
          </a>
          .
        </p>
      </main>

      <Footer />
    </>
  );
}
