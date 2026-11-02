"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/data/products";

const promoItems = [
  { label: "Everyday style", href: "/search/fashion", product: products[0] },
  { label: "Carry it well", href: "/search/home-office", product: products[1] },
  { label: "Desk essentials", href: "/search/official-store", product: products[2] },
  { label: "Layer up", href: "/search/fashion", product: products[3] },
  { label: "Little finds", href: "/search/baby-products", product: products[4] },
  { label: "New favorites", href: "/search", product: products[5] },
];

const utilityItems = [
  { label: "Browse everything", href: "/search", icon: "M4 4h6v6H4zm10 0h6v6h-6zm-10 10h6v6H4zm10 0h6v6h-6z" },
  { label: "Featured picks", href: "/search/official-store", icon: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" },
  { label: "Style edit", href: "/search/fashion", icon: "M8 4l4 2 4-2 4 4-3 4-2-2v10H9V10l-2 2-3-4 4-4z" },
  { label: "Home essentials", href: "/search/home-office", icon: "M4 11l8-7 8 7v9H4zM9 20v-6h6v6" },
  { label: "Gifts & extras", href: "/search/other-categories", icon: "M20 12v8H4v-8M2 8h20v4H2zm10 0v12M12 8H7.5a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8zm0 0h4.5a2.5 2.5 0 1 0 0-5C14 3 12 8 12 8z" },
];

function CategoryIcon({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
}

export function PromoStrip() {
  return (
    <section aria-label="Featured collections" className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-6 lg:px-8">
      <div className="image-grid-gap grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {promoItems.map(({ label, href, product }) => (
          <Link key={label} href={href} className="group relative min-h-[142px] overflow-hidden rounded-none border border-[#e2f7f9] bg-[#eaf9fa] p-3 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-[#087f8c]">
            <div className="relative z-10 max-w-[7rem]">
              <p className="t-body t-w-700 leading-tight text-[#111827]">{label}</p>
              <span className="mt-3 inline-flex rounded-none bg-white/85 px-2.5 py-1 t-badge t-w-700 uppercase tracking-[0.1em] text-[#087f8c]">Shop now</span>
            </div>
            <Image src={product.image} alt="" fill sizes="180px" className="object-contain object-right-bottom p-2 opacity-90 transition duration-500 group-hover:scale-110" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function UtilityStrip() {
  return (
    <section aria-label="Shop shortcuts" className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-6 lg:px-8">
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
        {utilityItems.map(({ label, href, icon }) => (
          <Link key={label} href={href} className="flex min-w-[172px] items-center gap-3 rounded-none border border-[#e5e7eb] bg-white px-4 py-3 t-body t-w-500 text-[#374151] shadow-[0_6px_14px_rgba(15,23,42,0.03)] transition hover:border-[#087f8c] hover:bg-[#eaf9fa] hover:text-[#087f8c]">
            <span className="flex h-9 w-9 items-center justify-center rounded-none bg-[#eaf9fa] text-[#087f8c]"><CategoryIcon path={icon} /></span>
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

function useCountdown() {
  const [remaining, setRemaining] = useState(2 * 60 * 60 + 14 * 60 + 36);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => (value > 0 ? value - 1 : 2 * 60 * 60 + 14 * 60 + 36)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0"));
}

export function FlashSaleHeader() {
  const [hours, minutes, seconds] = useCountdown();

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-none bg-[#111827] px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <p className="t-caption t-w-500 uppercase tracking-[0.18em] text-[#bcecf0]">Limited time</p>
        <h2 className="mt-1 t-title-section t-w-700 tracking-[-0.03em]">Flash Sales</h2>
      </div>
      <div className="flex items-center gap-2 t-body t-w-700 tabular-nums">
        <span className="rounded-none bg-white px-2.5 py-2 text-[#111827]">{hours}</span>
        <span className="text-[#7ad8e2]">:</span>
        <span className="rounded-none bg-white px-2.5 py-2 text-[#111827]">{minutes}</span>
        <span className="text-[#7ad8e2]">:</span>
        <span className="rounded-none bg-white px-2.5 py-2 text-[#111827]">{seconds}</span>
      </div>
    </div>
  );
}

export function CampaignBlocks() {
  const campaigns = [
    { title: "The everyday edit", copy: "Practical pieces with a little more character.", href: "/search", product: products[0], tone: "bg-[#e2f7f9]" },
    { title: "Small upgrades", copy: "Objects that make the daily routine better.", href: "/search/home-office", product: products[2], tone: "bg-[#e4f8fa]" },
    { title: "Made to move", copy: "Lightweight finds for wherever the day goes.", href: "/search/fashion", product: products[1], tone: "bg-[#fef3c7]" },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-2 pt-2 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">Shop by mood</p>
          <h2 className="mt-1 t-title-block t-w-700 tracking-[-0.04em] text-[#111827] sm:t-hero">Campaign picks</h2>
        </div>
        <Link href="/search" className="t-body t-w-500 text-[#087f8c] hover:text-[#0b6e78]">View all</Link>
      </div>
      <div className="image-grid-gap grid md:grid-cols-3">
        {campaigns.map(({ title, copy, href, product, tone }) => (
          <Link key={title} href={href} className={`group relative min-h-[180px] overflow-hidden rounded-none border border-[#e5e7eb] ${tone} p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(15,23,42,0.08)]`}>
            <div className="relative z-10 max-w-[58%]">
              <h3 className="t-title-section t-w-700 tracking-[-0.03em] text-[#111827]">{title}</h3>
              <p className="mt-2 t-body leading-5 text-[#374151]">{copy}</p>
              <span className="mt-5 inline-flex t-body t-w-700 text-[#087f8c]">Explore <span aria-hidden="true" className="ml-1 transition group-hover:translate-x-1">-&gt;</span></span>
            </div>
            <Image src={product.image} alt="" fill sizes="420px" className="object-contain object-right-bottom p-3 transition duration-500 group-hover:scale-105" />
          </Link>
        ))}
      </div>
    </section>
  );
}
