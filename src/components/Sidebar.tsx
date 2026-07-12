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
  // The two top-list widgets, in order: the first leads the sidebar, the second
  // sits under Editor's Picks. Same widget count and layout on every page, only
  // the pairing changes, so each hub leads with the list that matches its beat.
  topListKeys?: [string, string];
  // Scopes the Editor's Picks widget to a category's originals.
  editorialCategory?: string;
}

const DEFAULT_TOP_LISTS: [string, string] = ["top-vr-games-2026", "top-vr-apps"];

export function Sidebar({
  sourceStats,
  trending,
  topListKeys = DEFAULT_TOP_LISTS,
  editorialCategory,
}: SidebarProps) {
  const [topLists, setTopLists] = useState<Record<string, TopList>>({});

  useEffect(() => {
    fetch("/api/top-lists")
      .then((r) => r.json())
      .then((data) => setTopLists(data.lists || {}))
      .catch(() => {});
  }, []);

  const [leadKey, trailKey] = topListKeys;

  return (
    <div className="flex flex-col gap-5">
      {topLists[leadKey] && <TopListWidget list={topLists[leadKey]} />}
      <EditorsPicks category={editorialCategory} />
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
