"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { getMarketplaceProduct } from "@/lib/mock/marketplace";
import { ProductFeed } from "@/components/grid/product-feed";
import { EmptyResults } from "@/components/marketplace/empty-results";

const PAGE_SIZE = 24;
type SortKey = "relevance" | "price-asc" | "price-desc" | "rating";
const deliveries = ["Same-day", "1-2 days", "Standard"] as const;

export function SearchResults({
  products,
  title,
  description,
  query,
  suggestion,
}: {
  products: Product[];
  title: string;
  description?: string;
  query?: string;
  suggestion?: string | null;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<string>("");
  const [payment, setPayment] = useState<string>("");
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const categories = Array.from(new Set(products.map((product) => product.category)));

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const item = getMarketplaceProduct(product.id);
        return (
          item &&
          item.price <= maxPrice &&
          item.rating >= minRating &&
          (!selectedCategories.length || selectedCategories.includes(product.category)) &&
          (!delivery || item.delivery === delivery) &&
          (!payment || item.paymentMethods.includes(payment as "Paystack" | "COD"))
        );
      }),
    [products, maxPrice, minRating, selectedCategories, delivery, payment]
  );

  const sorted = useMemo(() => {
    if (sortKey === "relevance") return filtered;
    const rating = (product: Product) => getMarketplaceProduct(product.id)?.rating ?? 0;
    return [...filtered].sort((a, b) =>
      sortKey === "price-asc"
        ? a.price - b.price
        : sortKey === "price-desc"
          ? b.price - a.price
          : rating(b) - rating(a)
    );
  }, [filtered, sortKey]);

  useEffect(() => {
    if (!filtersOpen) return;

    const trigger = filterTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    filterCloseRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false);
        return;
      }
      if (event.key !== "Tab" || !filterPanelRef.current) return;

      const focusable = [...filterPanelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )];
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [filtersOpen]);

  const clear = () => {
    setVisible(PAGE_SIZE);
    setMaxPrice(500);
    setMinRating(0);
    setSelectedCategories([]);
    setDelivery("");
    setPayment("");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-6 rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#087f8c]">Marketplace search</p>
            <h1 className="mt-1 t-hero t-w-700 tracking-[-0.04em] text-[#111827]">{title}</h1>
          </div>
          <span className="rounded-none bg-[#eaf9fa] px-3 py-1.5 t-caption t-w-700 text-[#087f8c]">{filtered.length} products</span>
        </div>
        <p className="mt-3 t-body text-[#6b7280]">{description || "Compare sellers, delivery speed, ratings, and payment options."}</p>
      </header>

      <div className="flex items-center justify-between gap-3 pb-4">
        <button ref={filterTriggerRef} type="button" onClick={() => { setVisible(PAGE_SIZE); setFiltersOpen(true); }} className="min-h-12 rounded-none bg-[#111827] px-5 t-body t-w-700 text-white">Filters</button>
        <button type="button" onClick={clear} className="min-h-12 rounded-none border border-[#e5e7eb] px-5 t-body t-w-700 text-[#374151]">Clear all</button>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 p-4">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <div
            ref={filterPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
            className="relative z-10 ml-auto h-full max-w-sm overflow-y-auto rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-center justify-between">
              <h2 id="filter-title" className="t-w-700 text-[#111827]">Filter products</h2>
              <button ref={filterCloseRef} type="button" onClick={() => setFiltersOpen(false)} className="min-h-11 min-w-11 t-body t-w-700 text-[#6b7280]">Close</button>
            </div>
            <div className="mt-5 space-y-6">
              <div>
                <div className="flex justify-between t-body t-w-500 text-[#374151]">
                  <label htmlFor="max-price">Price up to</label>
                  <output htmlFor="max-price">${maxPrice.toLocaleString()}</output>
                </div>
                <input id="max-price" type="range" min="5" max="500" step="5" value={maxPrice} aria-valuetext={`Up to $${maxPrice}`} onChange={(event) => { setVisible(PAGE_SIZE); setMaxPrice(Number(event.target.value)); }} className="mt-3 min-h-11 w-full accent-[#17b5c9]" />
              </div>
              <fieldset>
                <legend className="t-body t-w-500 text-[#374151]">Category</legend>
                <div className="mt-2 space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex min-h-11 items-center gap-2 t-body text-[#6b7280]">
                        <input type="checkbox" checked={selectedCategories.includes(category)} onChange={(event) => { setVisible(PAGE_SIZE); setSelectedCategories((current) => event.target.checked ? [...current, category] : current.filter((item) => item !== category)); }} className="h-4 w-4 accent-[#17b5c9]" />
                      {category}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="t-body t-w-500 text-[#374151]">Seller rating</legend>
                <div className="mt-2 space-y-2">
                  {[3, 4, 5].map((rating) => (
                    <label key={rating} className="flex min-h-11 items-center gap-2 t-body text-[#6b7280]">
                      <input type="radio" name="rating" checked={minRating === rating} onChange={() => { setVisible(PAGE_SIZE); setMinRating(rating); }} className="h-4 w-4 accent-[#17b5c9]" />
                      {rating}★ and up
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="t-body t-w-500 text-[#374151]">Delivery</legend>
                <div className="mt-2 space-y-2">
                  {deliveries.map((item) => (
                    <label key={item} className="flex min-h-11 items-center gap-2 t-body text-[#6b7280]">
                      <input type="radio" name="delivery" checked={delivery === item} onChange={() => { setVisible(PAGE_SIZE); setDelivery(item); }} className="h-4 w-4 accent-[#17b5c9]" />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="t-body t-w-500 text-[#374151]">Payment</legend>
                <div className="mt-2 space-y-2">
                  {["Paystack", "COD"].map((item) => (
                    <label key={item} className="flex min-h-11 items-center gap-2 t-body text-[#6b7280]">
                      <input type="checkbox" checked={payment === item} onChange={() => { setVisible(PAGE_SIZE); setPayment(payment === item ? "" : item); }} className="h-4 w-4 accent-[#17b5c9]" />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="button" onClick={clear} className="min-h-12 w-full rounded-none border border-[#e5e7eb] t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">Clear all filters</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <section aria-label="Search results">
          <div className="mb-4 flex items-center justify-between t-body text-[#6b7280]">
            <span>Showing {Math.min(visible, sorted.length)} of {sorted.length} results</span>
            <label className="flex items-center gap-2">
              Sort by
              <select value={sortKey} onChange={(event) => { setVisible(PAGE_SIZE); setSortKey(event.target.value as SortKey); }} className="rounded-none border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 t-body text-[#111827] outline-none focus:border-[#087f8c]">
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
          {sorted.length ? (
            <>
              <ProductFeed products={sorted.slice(0, visible)} />
              {visible < sorted.length && (
                <div className="mt-8 text-center">
                  <button type="button" onClick={() => setVisible((count) => count + PAGE_SIZE)} className="min-h-12 border border-[#e5e7eb] bg-white px-8 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">
                    Show more ({sorted.length - visible} left)
                  </button>
                </div>
              )}
            </>
          ) : products.length === 0 ? (
            <EmptyResults query={query} suggestion={suggestion} />
          ) : (
            <div className="rounded-none border border-dashed border-[#cbd5e1] bg-white p-10 text-center">
              <h2 className="t-w-700 text-[#111827]">No products match these filters</h2>
              <button type="button" onClick={clear} className="mt-4 min-h-12 rounded-none bg-[#087f8c] px-5 t-body t-w-700 text-white">Clear filters</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
