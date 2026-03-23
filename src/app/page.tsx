"use client";

import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";
import { FilterBar } from "@/components/FilterBar";
import { Feed } from "@/components/Feed";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { useFeed } from "@/hooks/useFeed";
import { useFilters } from "@/hooks/useFilters";
import { SOURCES } from "@/lib/constants";

export default function Home() {
  const { articles, trending, sourceStats, lastUpdated, loading } = useFeed();
  const { activeFilter, filtered, setFilter } = useFilters(articles);

  const sourceCount = Object.keys(sourceStats).length || Object.keys(SOURCES).length;

  return (
    <>
      <Header articleCount={filtered.length} lastUpdated={lastUpdated} />
      <Ticker articles={articles} />
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        sourceCount={sourceCount}
      />

      <div className="max-w-[1400px] mx-auto px-6 pb-16 pt-5 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 relative z-10">
        <Feed articles={filtered} loading={loading} />
        <div className="order-first lg:order-last">
          <Sidebar sourceStats={sourceStats} trending={trending} />
        </div>
      </div>

      <Footer />
    </>
  );
}
