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
import { NewsletterSignup } from "./NewsletterSignup";

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
      <SourceStats stats={sourceStats} />
      <EditorsPicks />
      <NetActuateBanner />
      {topLists["top-vr-games-2026"] && (
        <TopListWidget list={topLists["top-vr-games-2026"]} />
      )}
      {topLists["top-vr-apps"] && (
        <TopListWidget list={topLists["top-vr-apps"]} />
      )}
      <NewsletterSignup />
      <AdSlot />
      <TrendingTopics topics={trending} />
    </div>
  );
}
