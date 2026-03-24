"use client";

import type { TrendingTopic } from "@/types";
import { SourceStats } from "./SourceStats";
import { TopListWidget } from "./TopListWidget";
import { TrendingTopics } from "./TrendingTopics";
import { NetActuateBanner } from "./NetActuateBanner";
import { AdSlot } from "./AdSlot";
import { TOP_VR_GAMES_2026, TOP_VR_APPS } from "@/lib/top-lists";

interface SidebarProps {
  sourceStats: Record<string, { name: string; count: number }>;
  trending: TrendingTopic[];
}

export function Sidebar({ sourceStats, trending }: SidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      <SourceStats stats={sourceStats} />
      <NetActuateBanner />
      <TopListWidget list={TOP_VR_GAMES_2026} />
      <TopListWidget list={TOP_VR_APPS} />
      <AdSlot />
      <TrendingTopics topics={trending} />
    </div>
  );
}
