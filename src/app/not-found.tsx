import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-24 text-center"
        style={{ color: "var(--text-primary)" }}
      >
        <div
          className="font-display text-8xl font-bold mb-4"
          style={{ color: "var(--accent-cyan)", letterSpacing: "-2px" }}
        >
          404
        </div>
        <h1 className="font-display text-2xl font-semibold mb-3">
          Page not found
        </h1>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/"
            className="text-[13px] font-medium px-5 py-2.5 rounded-lg no-underline transition-all"
            style={{
              background: "var(--accent-cyan)",
              color: "var(--bg-primary)",
            }}
          >
            Back to Feed
          </a>
          <div className="flex gap-3">
            {["Hardware", "Gaming", "Software", "AR"].map((cat) => (
              <a
                key={cat}
                href={`/${cat.toLowerCase()}`}
                className="text-[13px] font-medium px-4 py-2.5 rounded-lg no-underline border transition-all hover:border-[var(--accent-cyan)]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
