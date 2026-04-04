"use client";

interface NewsletterSignupProps {
  variant?: "sidebar" | "footer" | "article";
}

export function NewsletterSignup({ variant = "sidebar" }: NewsletterSignupProps) {
  if (variant === "footer") {
    return (
      <form
        action="https://buttondown.com/api/emails/newsletter-subscribe"
        method="post"
        target="_blank"
        className="flex flex-wrap items-center gap-2 w-full pt-3"
      >
        <input type="hidden" name="tag" value="vr-org" />
        <span
          className="font-mono text-[10px] tracking-[0.5px] flex-shrink-0"
          style={{ color: "var(--text-muted)" }}
        >
          Get the weekly roundup:
        </span>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className="font-mono text-[11px] px-2.5 py-1 rounded-[5px] border outline-none transition-colors w-[180px]"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-cyan)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        />
        <button
          type="submit"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.5px] px-3 py-1 rounded-[5px] border-none cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: "var(--accent-cyan)",
            color: "#fff",
          }}
        >
          Subscribe
        </button>
      </form>
    );
  }

  if (variant === "article") {
    return (
      <div
        className="rounded-[10px] border p-6 my-8"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
      >
        <div
          className="font-display text-[15px] font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Enjoyed this article?
        </div>
        <p
          className="text-[13px] leading-[1.6] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Get our weekly roundup of the biggest VR, AR, and XR stories delivered to your inbox every Friday.
        </p>
        <form
          action="https://buttondown.com/api/emails/newsletter-subscribe"
          method="post"
          target="_blank"
          className="flex gap-2"
        >
          <input type="hidden" name="tag" value="vr-org" />
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="flex-1 text-[13px] px-3 py-2 rounded-[6px] border outline-none transition-colors"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-cyan)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          />
          <button
            type="submit"
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.5px] px-4 py-2 rounded-[6px] border-none cursor-pointer transition-opacity hover:opacity-80 flex-shrink-0"
            style={{
              background: "var(--accent-cyan)",
              color: "#fff",
            }}
          >
            Subscribe
          </button>
        </form>
        <p
          className="font-mono text-[10px] mt-2"
          style={{ color: "var(--text-muted)" }}
        >
          Free. No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Default: sidebar variant
  return (
    <div
      className="rounded-[10px] border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div
        className="font-display text-xs font-semibold uppercase tracking-[2px] mb-3 flex items-center gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="text-sm">&#128236;</span> VR.org Weekly
      </div>
      <p
        className="text-[13px] leading-[1.55] mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        The top VR, AR, and XR stories delivered every Friday.
      </p>
      <form
        action="https://buttondown.com/api/emails/newsletter-subscribe"
        method="post"
        target="_blank"
        className="flex flex-col gap-2"
      >
        <input type="hidden" name="tag" value="vr-org" />
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className="w-full text-[13px] px-3 py-2 rounded-[6px] border outline-none transition-colors"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-cyan)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        />
        <button
          type="submit"
          className="w-full font-mono text-[11px] font-semibold uppercase tracking-[1px] px-4 py-2.5 rounded-[6px] border-none cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: "var(--accent-cyan)",
            color: "#fff",
          }}
        >
          Subscribe
        </button>
      </form>
      <p
        className="font-mono text-[10px] mt-2 text-center"
        style={{ color: "var(--text-muted)" }}
      >
        Free. No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
