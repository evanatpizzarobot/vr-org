"use client";

import type { TopList } from "@/lib/top-lists";

interface TopListWidgetProps {
  list: TopList;
}

/** Rendered size in CSS pixels. Files are generated at 2x for retina. */
const THUMB = 44;

export function TopListWidget({ list }: TopListWidgetProps) {
  // Lists with no artwork at all (headsets, apps, AR glasses) render exactly as
  // they did before thumbnails existed. Only opt in once an item has an image.
  const hasThumbs = list.items.some((item) => item.image);

  return (
    <div
      className="rounded-[10px] border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div
        className="font-display text-xs font-semibold uppercase tracking-[2px] mb-4 flex items-center gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="text-sm">{list.icon}</span> {list.title}
      </div>

      {list.items.map((item) => (
        <div
          key={item.rank}
          className={`flex gap-2.5 py-[7px] ${hasThumbs ? "items-center" : "items-baseline"}`}
          style={{
            borderBottom:
              "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
          }}
        >
          <span
            className="font-mono text-[11px] w-[18px] flex-shrink-0 text-right"
            style={{ color: "var(--accent-cyan)" }}
          >
            {item.rank}.
          </span>
          <div className="min-w-0 flex-1">
            <span
              className="text-[13px] font-medium block leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {item.title}
            </span>
            <span
              className="font-mono text-[10px] block mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {item.subtitle}
            </span>
          </div>

          {hasThumbs &&
            (item.image ? (
              <img
                src={item.image}
                alt=""
                aria-hidden="true"
                width={THUMB}
                height={THUMB}
                loading="lazy"
                decoding="async"
                className="flex-shrink-0 rounded-[7px] object-cover"
                style={{
                  width: THUMB,
                  height: THUMB,
                  border: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
                }}
              />
            ) : (
              // Keeps the row rhythm when a title has no usable box art, which
              // reads as deliberate rather than as a broken image.
              <div
                aria-hidden="true"
                className="flex-shrink-0 rounded-[7px] flex items-center justify-center"
                style={{
                  width: THUMB,
                  height: THUMB,
                  background: "var(--bg-secondary)",
                  border: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
                  fontSize: 15,
                  opacity: 0.35,
                }}
              >
                {list.icon}
              </div>
            ))}
        </div>
      ))}

      <a
        href={list.href}
        className="flex items-center justify-center gap-1 mt-4 text-[12px] font-medium no-underline transition-colors hover:underline"
        style={{ color: "var(--accent-cyan)" }}
      >
        View full list &rarr;
      </a>
    </div>
  );
}
