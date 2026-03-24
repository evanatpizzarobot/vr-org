"use client";

import type { TrendingTopic } from "@/types";
import { SourceStats } from "./SourceStats";
import { TrendingTopics } from "./TrendingTopics";
import { NetActuateBanner } from "./NetActuateBanner";
import { AdSlot } from "./AdSlot";

interface SidebarProps {
  sourceStats: Record<string, { name: string; count: number }>;
  trending: TrendingTopic[];
}

export function Sidebar({ sourceStats, trending }: SidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      <SourceStats stats={sourceStats} />
      <NetActuateBanner />
      <TrendingTopics topics={trending} />
      <AdSlot />
    </div>
  );
}
