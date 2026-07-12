"use client";

import { useEffect, useState } from "react";
import type { TrendingTopic } from "@/types";
import type { TopList } from "@/lib/top-lists";
import { SourceStats } from "./SourceStats";
import { TopListWidget } from "./TopListWidget";
import { TrendingTopics } from "./TrendingTopics";
import { NetActuateBanner } from "./NetActuateBanner";
import { EditorsPicks } from "./EditorsPicks";
import { AdSlot } from "./AdSlot";
import { AD_SLOTS } from "@/lib/ads";


interface SidebarProps {
  sourceStats: Record<string, { name: string; count: number }>;
  trending: TrendingTopic[];
  // Which top-list leads the sidebar. Same widgets everywhere, only the order
  // changes, so pages whose content is apps-first (like /software) do not lead
  // with a games list.
  topListPriority?: "games" | "apps";
}

export function Sidebar({ sourceStats, trending, topListPriority = "games" }: SidebarProps) {
  const [topLists, setTopLists] = useState<Record<string, TopList>>({});

  useEffect(() => {
    fetch("/api/top-lists")
      .then((r) => r.json())
      .then((data) => setTopLists(data.lists || {}))
      .catch(() => {});
  }, []);

  const [leadKey, trailKey] =
    topListPriority === "apps"
      ? (["top-vr-apps", "top-vr-games-2026"] as const)
      : (["top-vr-games-2026", "top-vr-apps"] as const);

  return (
    <div className="flex flex-col gap-5">
      {topLists[leadKey] && <TopListWidget list={topLists[leadKey]} />}
      <EditorsPicks />
      {topLists[trailKey] && <TopListWidget list={topLists[trailKey]} />}
      <NetActuateBanner />
      <div className="sidebar-sticky-ad">
        <AdSlot
          slot={AD_SLOTS.sidebar}
          format="rectangle"
          className="ad-card rounded-lg"
          minHeight={250}
        />
      </div>
      <TrendingTopics topics={trending} />
      <SourceStats stats={sourceStats} />
    </div>
  );
}
