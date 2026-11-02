"use client";

import Link from "next/link";
import { useState } from "react";

const trending = ["iPhone 15", "Laptops under 100k", "Fashion deals"];

export function SearchAutocomplete({ mobile = false }: { mobile?: boolean }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const suggestions = value.trim() ? [value, ...trending.filter((item) => item.toLowerCase().includes(value.toLowerCase()))].slice(0, 4) : trending;
  return (
    <form action="/search" className={`relative ${mobile ? "pb-3 md:hidden" : "hidden min-w-0 flex-1 md:block"}`}>
      <div className="relative">
        <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path strokeLinecap="round" d="m16 16 5 5" /></svg>
        <input name="q" value={value} onChange={(event) => setValue(event.target.value)} onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 120)} placeholder={mobile ? "Search products..." : "Search for products, brands and more..."} autoComplete="off" className={`w-full rounded-full border border-[#e5e7eb] bg-white py-3 pl-12 pr-14 t-16 text-[#111827] placeholder:text-[#6b7280] focus:border-[#087f8c] focus:bg-white ${mobile ? "shadow-sm" : "bg-[#f5f5f5]"}`} />
        <button type="submit" aria-label="Search" className={`absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#087f8c] text-white hover:bg-[#0b6e78] ${mobile ? "h-9 w-9" : "h-10 w-10"}`}><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path strokeLinecap="round" d="m16 16 5 5" /></svg></button>
      </div>
      {open && <div className="absolute inset-x-0 top-[calc(100%-4px)] z-50 rounded-2xl border border-[#e5e7eb] bg-white p-2 shadow-[0_18px_36px_rgba(15,23,42,0.12)]"><p className="px-3 py-2 t-badge t-w-700 uppercase tracking-[0.16em] text-[#6b7280]">{value ? "Suggestions" : "Trending searches"}</p>{suggestions.map((item) => <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="flex min-h-11 items-center rounded-xl px-3 t-body text-[#374151] hover:bg-[#eaf9fa] hover:text-[#087f8c]">{item}</Link>)}</div>}
    </form>
  );
}
