"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import { useRecentSearches } from "@/components/search/use-recent-searches";
import { getTrendingSearches, suggestCatalog } from "@/lib/mock/marketplace";

type Row = { key: string; href: string; label: string; hint?: string; recent?: string };

/**
 * The search field in the top navigation, with suggestions.
 * - Empty field: your recent searches (each can be removed) and trending searches.
 * - Typing: matching products, plus "Search for ..." (uses the same search engine as the results page).
 * - Keyboard: Up/Down to move, Enter to open the highlighted row, Escape to close.
 */
export function SearchBox({ variant }: { variant: "desktop" | "mobile" }) {
  const router = useRouter();
  const listId = useId();
  const wrapRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const { searches, remove } = useRecentSearches();

  const query = value.trim();
  const rows: Row[] = useMemo(() => {
    if (query) {
      const products = suggestCatalog(query, 5).map((product) => ({ key: `p-${product.id}`, href: `/product/${product.handle}`, label: product.title, hint: product.category }));
      return [...products, { key: "all", href: `/search?q=${encodeURIComponent(query)}`, label: `Search for “${query}”` }];
    }
    const recent = searches.slice(0, 5).map((term) => ({ key: `r-${term}`, href: `/search?q=${encodeURIComponent(term)}`, label: term, hint: "Recent", recent: term }));
    const trending = (recent.length ? [] : getTrendingSearches(5)).map((term) => ({ key: `t-${term}`, href: `/search?q=${encodeURIComponent(term)}`, label: term, hint: "Trending" }));
    return [...recent, ...trending];
  }, [query, searches]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      // First Escape closes the list. We stop the browser from also clearing the field (it would reopen the list).
      if (open) {
        e.preventDefault();
        close();
      }
      return;
    }
    if (!rows.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % rows.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? rows.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0 && rows[active]) {
      e.preventDefault();
      router.push(rows[active].href);
      close();
    }
  };

  const desktop = variant === "desktop";
  return (
    <form
      ref={wrapRef}
      action="/search"
      role="search"
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) close();
      }}
      className={desktop ? "relative hidden h-[60px] w-full max-w-[650px] justify-self-center rounded-full bg-[#f1f1f1] xl:flex" : "relative mb-3 h-[60px] rounded-full bg-[#f1f1f1] xl:hidden"}
    >
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search products, brands and categories"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && rows.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        className={desktop ? "h-full w-full rounded-full border-0 bg-transparent py-3 pl-12 pr-[112px] t-16 text-black shadow-none placeholder:text-[#5b5b5b]" : "h-full w-full rounded-full border-0 bg-transparent px-4 py-3 pl-11 pr-[104px] t-14 text-black shadow-none placeholder:text-[#5b5b5b]"}
      />
      <svg aria-hidden="true" className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#333333] ${desktop ? "left-5 h-6 w-6" : "left-3 h-5 w-5"}`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
      <button type="submit" aria-label="Search" className={desktop ? "absolute bottom-[5px] right-[5px] top-[5px] w-[96px] rounded-full bg-[#dc2626] t-16 t-w-700 text-white transition hover:bg-[#b91c1c]" : "absolute bottom-[5px] right-[5px] top-[5px] w-[88px] rounded-full bg-[#dc2626] t-14 t-w-700 text-white transition hover:bg-[#b91c1c]"}>
        Search
      </button>

      {open && rows.length > 0 && (
        <ul id={listId} role="listbox" aria-label="Search suggestions" className={`absolute inset-x-0 z-50 border border-[#e5e7eb] bg-white py-1 shadow-[0_18px_36px_rgba(15,23,42,0.12)] ${desktop ? "top-full" : "top-[calc(100%-12px)]"}`}>
          {!query && searches.length > 0 && <li role="presentation" className="px-4 pb-1 pt-2 t-caption t-w-700 uppercase tracking-wide text-[#6b7280]">Recent searches</li>}
          {!query && searches.length === 0 && <li role="presentation" className="px-4 pb-1 pt-2 t-caption t-w-700 uppercase tracking-wide text-[#6b7280]">Trending searches</li>}
          {rows.map((row, index) => (
            <li key={row.key} role="presentation" className={`flex items-center ${index === active ? "bg-[#eaf9fa]" : "hover:bg-[#f9fafb]"}`}>
              <Link id={`${listId}-${index}`} role="option" aria-selected={index === active} href={row.href} onClick={close} className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-2.5 t-body text-[#111827]">
                <span className="truncate">{row.label}</span>
                {row.hint && <span className="flex-none t-caption capitalize text-[#6b7280]">{row.hint}</span>}
              </Link>
              {row.recent && (
                <button type="button" aria-label={`Remove ${row.recent} from recent searches`} onClick={() => remove(row.recent!)} className="px-3 py-2 t-body text-[#6b7280] hover:text-[#dc2626]">×</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
