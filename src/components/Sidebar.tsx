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
}

export function Sidebar({ sourceStats, trending }: SidebarProps) {
  const [topLists, setTopLists] = useState<Record<string, TopList>>({});

  useEffect(() => {
    fetch("/api/top-lists")
      .then((r) => r.json())
      .then((data) => setTopLists(data.lists || {}))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {topLists["top-vr-games-2026"] && (
        <TopListWidget list={topLists["top-vr-games-2026"]} />
      )}
      <EditorsPicks />
      {topLists["top-vr-apps"] && (
        <TopListWidget list={topLists["top-vr-apps"]} />
      )}
      <NetActuateBanner />
      <AdSlot
        slot={AD_SLOTS.sidebar}
        format="rectangle"
        className="rounded-lg"
        minHeight={250}
      />
      <TrendingTopics topics={trending} />
      <SourceStats stats={sourceStats} />
    </div>
  );
}
