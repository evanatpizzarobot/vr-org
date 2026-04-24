import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";

export const metadata = {
  title: "Privacy Policy | VR.org",
  description: "VR.org privacy policy. How we handle data, cookies, and third-party services.",
  alternates: {
    canonical: "https://vr.org/privacy",
  },
  openGraph: {
    title: "Privacy Policy | VR.org",
    description: "VR.org privacy policy. How we handle data, cookies, and third-party services.",
    url: "https://vr.org/privacy",
    siteName: "VR.org",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "Privacy", url: "https://vr.org/privacy" },
        ])}
      />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          Last updated: March 23, 2026
        </p>

        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the vr.org website. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our site.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Information we collect</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>Automatically collected information:</strong>{" "}
          When you visit VR.org, our servers may automatically log standard technical information such as your IP address, browser type, operating system, referring URL, pages visited, and the date and time of your visit. This information is used solely for site operation, security, and analytics purposes.
        </p>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>Cookies:</strong>{" "}
          VR.org uses cookies to remember your theme preference (light or dark mode). We do not use cookies for tracking or profiling purposes.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>Third-party advertising:</strong>{" "}
          VR.org uses Google AdSense to display advertisements. Google and its partners may use cookies and similar technologies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising at any time by visiting{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Google Ads Settings
          </a>
          .
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Affiliate disclosure</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org participates in affiliate programs, including the Amazon Services LLC Associates Program, B&amp;H Photo, the Meta Quest Creator Affiliate Program, and others. When you click on product links on our{" "}
          <a href="/deals" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
            deals page
          </a>
          {" "}and make a qualifying purchase, we may earn a small commission at no additional cost to you.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          Affiliate relationships do not influence our editorial coverage. Product recommendations are made by our editors based on hands-on testing, research, and industry expertise. Articles on VR.org do not contain affiliate links; all affiliate links live on the dedicated /deals page.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Information we do not collect</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org does not require user registration or accounts. We do not collect names, email addresses, or any other personally identifiable information unless you voluntarily contact us via email.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">How we use information</h2>
        <p className="text-[15px] leading-[1.7] mb-2" style={{ color: "var(--text-secondary)" }}>
          We use automatically collected technical information to:
        </p>
        <ul className="text-[15px] leading-[1.7] mb-8 list-disc pl-6 flex flex-col gap-1" style={{ color: "var(--text-secondary)" }}>
          <li>Operate and maintain the website</li>
          <li>Monitor site performance and uptime</li>
          <li>Protect against security threats</li>
          <li>Understand general usage patterns through aggregated, non-identifying analytics</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold mb-4">Third-party links</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org is a news aggregator. Our feed contains links to articles on third-party websites. We are not responsible for the privacy practices or content of those external sites. We encourage you to review the privacy policies of any site you visit through our links.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Third-party services</h2>
        <ul className="text-[15px] leading-[1.7] mb-8 list-disc pl-6 flex flex-col gap-1" style={{ color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Google Analytics:</strong> Website analytics. See{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              Google&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Google AdSense:</strong> Advertising network. See{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              how Google uses information from sites that use our services
            </a>
            .
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Affiliate networks:</strong> Amazon Associates, B&amp;H Photo, Meta Quest Creator Program, ZyberVR affiliate program, and similar programs linked from our /deals page.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold mb-4">Data retention</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          Server logs are retained for a maximum of 30 days and are then automatically deleted. We do not maintain long-term records of visitor activity.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Children&apos;s privacy</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Changes to this policy</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Contact us</h2>
        <p className="text-[15px] leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
          If you have any questions about this privacy policy, please contact us at{" "}
          <a href="mailto:contact@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
            contact@vr.org
          </a>
          .
        </p>
      </main>

      <Footer />
    </>
  );
}
