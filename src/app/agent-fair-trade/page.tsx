import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";

export const metadata = {
  title: "Agent Fair-Trade Agreement | VR.org",
  description:
    "VR.org publishes a /.well-known/agent-fair-trade.json manifest with code-enforced no-charge guarantees, Ed25519-signed receipts, and a federated USDC-on-Base credit ledger. The agent-facing API is built to be fair to AI agents.",
  alternates: { canonical: "https://vr.org/agent-fair-trade" },
  openGraph: {
    title: "Agent Fair-Trade Agreement | VR.org",
    description:
      "Federation member of the TensorFeed AFTA standard. Code-enforced no-charge guarantees, signed receipts, transparent pricing, inference-only license.",
    url: "https://vr.org/agent-fair-trade",
    siteName: "VR.org",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Agent Fair-Trade Agreement (AFTA)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AFTA is an open, voluntary standard for API publishers that commit to being fair to AI agents: code-enforced no-charge guarantees on common failure modes, cryptographically signed receipts, transparent pricing, and an inference-only data license.",
      },
    },
    {
      "@type": "Question",
      name: "How do I pay for VR.org premium endpoints?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "VR.org is a federation member of the TensorFeed credit ledger. Mint a bearer token on tensorfeed.ai/api/payment/buy-credits using USDC on Base mainnet. The same token works across tensorfeed.ai, terminalfeed.io, and vr.org with no re-auth.",
      },
    },
    {
      "@type": "Question",
      name: "What gets a no-charge guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Four conditions: server errors (HTTP 5xx), the federation rail circuit breaker tripping, schema validation failures (HTTP 400), and stale data (response older than the published freshness SLA). Each is enforced in the code, not just stated in policy.",
      },
    },
  ],
};

export default function AgentFairTradePage() {
  return (
    <>
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "Agent Fair-Trade", url: "https://vr.org/agent-fair-trade" },
        ])}
      />
      <StructuredData data={faqJsonLd} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[760px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-3"
          style={{ letterSpacing: "-0.5px" }}
        >
          Agent Fair-Trade Agreement
        </h1>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          VR.org is an AFTA adopter and a federation member of the TensorFeed
          credit ledger. The premium API is built to be fair to AI agents:
          code-enforced no-charge guarantees, Ed25519-signed receipts on every
          paid call, transparent pricing on a public on-chain rail, and an
          inference-only data license.
        </p>

        <h2 className="font-display text-2xl font-semibold mt-10 mb-4">
          The four no-charge guarantees
        </h2>
        <ul
          className="text-[15px] leading-[1.7] mb-6 flex flex-col gap-3 list-disc pl-5"
          style={{ color: "var(--text-secondary)" }}
        >
          <li>
            <strong style={{ color: "var(--text-primary)" }}>5xx errors.</strong>{" "}
            If a premium handler throws, no credit is charged. Verifiable via
            the public no-charge ledger.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>
              Circuit breaker.
            </strong>{" "}
            If the federation rail to tensorfeed.ai is unreachable after the
            handler ran, the call is logged as no-charge rather than billed for
            an event we cannot commit cleanly.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>
              Schema validation failure.
            </strong>{" "}
            Requests that fail input validation return HTTP 400 with a signed
            receipt showing credits_charged: 0. Send a malformed query to{" "}
            <a
              href="/api/premium/news/search"
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              /api/premium/news/search
            </a>{" "}
            to see it.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Stale data.</strong>{" "}
            If the underlying RSS index is older than the endpoint freshness
            SLA, the call is not charged and the response is flagged with
            stale: true so the agent knows to retry later.
          </li>
        </ul>

        <h2
          id="receipts"
          className="font-display text-2xl font-semibold mt-10 mb-4"
        >
          Receipts
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Every paid call returns a JSON receipt signed with VR.org&apos;s own
          Ed25519 keypair. Agents verify against the public JWK at{" "}
          <a
            href="/.well-known/vr-org-receipt-key.json"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /.well-known/vr-org-receipt-key.json
          </a>{" "}
          with no shared secret. The signed fields cover endpoint, method,
          token reference, credits charged, balance remaining, request hash,
          response hash, captured-at, server time, no-charge reason, and the
          freshness SLA at the time of issuance.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Each federation member signs with its own keypair. A receipt from
          tensorfeed.ai verifies against TensorFeed&apos;s key. A receipt from
          vr.org verifies against this key. Receipt provenance is independent
          per site even though the credit ledger is shared.
        </p>

        <h2 className="font-display text-2xl font-semibold mt-10 mb-4">
          Federation
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          VR.org is a federation member of the TensorFeed AFTA network. The
          host credit ledger lives on tensorfeed.ai. Members validate bearer
          tokens against the host via a server-to-server rail (X-Internal-Auth
          shared secret) and commit deferred debits the same way. The result:
          one bearer token, three sites.
        </p>
        <ul
          className="text-[15px] leading-[1.7] mb-4 flex flex-col gap-2 list-disc pl-5"
          style={{ color: "var(--text-secondary)" }}
        >
          <li>
            <a
              href="https://tensorfeed.ai/agent-fair-trade"
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              tensorfeed.ai
            </a>{" "}
            (host) : AI news, model pricing, infra status
          </li>
          <li>
            <a
              href="https://terminalfeed.io/agent-fair-trade"
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              terminalfeed.io
            </a>{" "}
            : real-time data dashboards
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>vr.org</strong> :
            VR / AR / XR news + original editorial
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold mt-10 mb-4">
          Pricing
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Mint credits on the host ledger:{" "}
          <a
            href="https://tensorfeed.ai/api/payment/buy-credits"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            tensorfeed.ai/api/payment/buy-credits
          </a>
          . Currency: USDC on Base mainnet. Per-endpoint costs and freshness
          SLAs are listed at{" "}
          <a
            href="/api/payment/info"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /api/payment/info
          </a>{" "}
          and{" "}
          <a
            href="/api/meta"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /api/meta
          </a>
          .
        </p>

        <h2
          id="license"
          className="font-display text-2xl font-semibold mt-10 mb-4"
        >
          License
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Premium API responses are licensed for inference use only. Use of
          VR.org premium data for training, fine-tuning, evaluation, or
          distillation of machine learning models is prohibited. The free feed
          endpoints (
          <a
            href="/api/feed"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /api/feed
          </a>
          ,{" "}
          <a
            href="/api/articles"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /api/articles
          </a>
          ,{" "}
          <a
            href="/api/trending"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /api/trending
          </a>
          ) are open for any agent use that respects the upstream sources&apos;
          own terms.
        </p>

        <h2 className="font-display text-2xl font-semibold mt-10 mb-4">
          Public no-charge ledger
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Every no-charge event is publicly recorded. View the local view at{" "}
          <a
            href="/api/payment/no-charge-stats"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /api/payment/no-charge-stats
          </a>{" "}
          or the canonical network-wide ledger at{" "}
          <a
            href="https://tensorfeed.ai/api/payment/no-charge-stats"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            tensorfeed.ai/api/payment/no-charge-stats
          </a>
          .
        </p>

        <h2 className="font-display text-2xl font-semibold mt-10 mb-4">
          Adoption is the certification
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          AFTA is open, voluntary, and free. There is no certification
          authority. The schema lives at{" "}
          <a
            href="https://tensorfeed.ai/.well-known/agent-fair-trade-schema.json"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            tensorfeed.ai/.well-known/agent-fair-trade-schema.json
          </a>
          . Any publisher can self-publish a conforming{" "}
          <code>/.well-known/agent-fair-trade.json</code> with code-pointer
          attestations and join the conversation. We invite other agent-friendly
          API publishers to do exactly that.
        </p>

        <p
          className="text-[13px] leading-[1.6] mt-12 pt-6 border-t"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--border)",
          }}
        >
          VR.org is co-founded by Evan Marcus and Mark Mahle. The AFTA
          implementation here was built in collaboration with Claude
          (Anthropic), the same harness pattern proven on tensorfeed.ai and
          terminalfeed.io. Manifest:{" "}
          <a
            href="/.well-known/agent-fair-trade.json"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            /.well-known/agent-fair-trade.json
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
