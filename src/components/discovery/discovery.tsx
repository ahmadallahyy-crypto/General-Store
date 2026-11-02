"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductFeed } from "@/components/grid/product-feed";
import { useRecentSearches } from "@/components/search/use-recent-searches";
import { getMarketplaceProduct, getTrendingProducts, getTrendingSearches, searchCatalog } from "@/lib/mock/marketplace";
import type { MarketplaceProduct } from "@/lib/types";

export type DiscoverySection = "searched" | "viewed" | "trending";

const chip =
  "inline-flex min-h-10 items-center border border-[#e5e7eb] bg-white px-4 t-body capitalize text-[#374151] hover:border-[#087f8c] hover:text-[#087f8c]";

function Heading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#6b7280]">{eyebrow}</p>
        <h2 className="mt-1 t-title-block t-w-700 text-[#111827]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

// "Recently searched" chips (saved in this browser) plus products for the latest search.
// With no history yet, it shows "Trending searches" so the section is never empty.
function RecentlySearched() {
  const { searches: recent, remove, clear } = useRecentSearches();

  if (!recent.length) {
    return (
      <section aria-labelledby="trending-searches">
        <Heading eyebrow="Popular right now" title="Trending searches" />
        <div id="trending-searches" className="flex flex-wrap gap-2">
          {getTrendingSearches(8).map((term) => (
            <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className={chip}>{term}</Link>
          ))}
        </div>
      </section>
    );
  }

  const matches = searchCatalog({ query: recent[0] })
    .map((product) => getMarketplaceProduct(product.id))
    .filter((product): product is MarketplaceProduct => Boolean(product))
    .slice(0, 6);

  return (
    <section aria-labelledby="recent-searches">
      <Heading
        eyebrow="Pick up where you left off"
        title="Recently searched"
        action={<button type="button" onClick={clear} className="t-body t-w-700 text-[#087f8c]">Clear all</button>}
      />
      <div id="recent-searches" className="mb-4 flex flex-wrap gap-2">
        {recent.map((term) => (
          <span key={term} className="inline-flex items-stretch border border-[#e5e7eb] bg-white hover:border-[#087f8c]">
            <Link href={`/search?q=${encodeURIComponent(term)}`} className="inline-flex min-h-10 items-center pl-4 pr-2 t-body capitalize text-[#374151] hover:text-[#087f8c]">{term}</Link>
            <button type="button" onClick={() => remove(term)} aria-label={`Remove ${term} from recent searches`} className="px-2.5 t-body text-[#6b7280] hover:text-[#dc2626]">×</button>
          </span>
        ))}
      </div>
      {matches.length > 0 && <ProductFeed products={matches} />}
    </section>
  );
}

// Products this browser opened recently (the product page records them).
function RecentlyViewed({ excludeIds }: { excludeIds: string[] }) {
  const [items, setItems] = useState<MarketplaceProduct[]>([]);
  const key = excludeIds.join(",");
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const ids = JSON.parse(window.localStorage.getItem("recentlyViewed") || "[]") as string[];
        const skip = new Set(key ? key.split(",") : []);
        setItems(
          ids
            .map((id) => getMarketplaceProduct(id))
            .filter((product): product is MarketplaceProduct => Boolean(product) && !skip.has(product!.id))
            .slice(0, 6)
        );
      } catch {
        setItems([]);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [key]);

  if (!items.length) return null;
  return (
    <section aria-labelledby="recently-viewed-title">
      <Heading eyebrow="Your history" title="Recently viewed" />
      <ProductFeed products={items} />
    </section>
  );
}

function TrendingNow({ excludeIds }: { excludeIds: string[] }) {
  const items = getTrendingProducts(6, excludeIds);
  return (
    <section aria-labelledby="trending-now">
      <Heading eyebrow="Most popular" title="Trending now" action={<Link href="/search" className="t-body t-w-700 text-[#087f8c]">See all products</Link>} />
      <div id="trending-now"><ProductFeed products={items} /></div>
    </section>
  );
}

/**
 * Shared "keep shopping" block for every page except home:
 * Recently searched (or Trending searches) + Recently viewed + Trending now.
 * `bare` removes the outer container when a page already provides its own padding.
 */
export function Discovery({
  excludeIds = [],
  sections = ["searched", "viewed", "trending"],
  bare = false,
}: {
  excludeIds?: string[];
  sections?: DiscoverySection[];
  bare?: boolean;
}) {
  return (
    <div className={bare ? "mt-8 space-y-10" : "mx-auto max-w-[1400px] space-y-10 px-4 pb-14 pt-6 sm:px-6 lg:px-8"} aria-label="Keep shopping">
      {sections.includes("searched") && <RecentlySearched />}
      {sections.includes("viewed") && <RecentlyViewed excludeIds={excludeIds} />}
      {sections.includes("trending") && <TrendingNow excludeIds={excludeIds} />}
    </div>
  );
}
