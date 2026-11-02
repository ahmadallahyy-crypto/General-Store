"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { flashSaleProducts, getSeller } from "@/lib/mock/marketplace";
import type { MarketplaceProduct } from "@/lib/types";

function useRemaining(end?: string) {
  const [seconds, setSeconds] = useState(0);
  const deadline = useRef<number | null>(null);
  useEffect(() => {
    deadline.current = end ? new Date(end).getTime() : Date.now() + 3600000;
    const update = () => {
      if (deadline.current !== null) {
        setSeconds(Math.max(0, Math.floor((deadline.current - Date.now()) / 1000)));
      }
    };
    const frame = window.requestAnimationFrame(update);
    const timer = window.setInterval(update, 1000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, [end]);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function SaleCard({ product }: { product: MarketplaceProduct }) {
  const seller = getSeller(product.sellerId);
  const timer = useRemaining(product.saleEndsAt);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const stockPercent = product.stockTotal ? (product.stockLeft ?? 0) / product.stockTotal * 100 : 30;

  return (
    <li className="w-[210px] flex-none animate-[pulse_4s_ease-in-out_infinite] rounded-none border border-[#fee2e2] bg-white p-3 shadow-[0_8px_18px_rgba(15,23,42,0.04)] [animation-delay:var(--delay)]">
      <Link href={`/product/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-none bg-[#fff7f7]">
          <Image src={product.image} alt={product.title} fill sizes="210px" className="object-contain p-2" />
          <span className="absolute left-2 top-2 rounded-none bg-[#dc2626] px-2 py-1 t-badge t-w-700 text-white">-{discount}%</span>
        </div>
        <p className="mt-3 truncate t-body t-w-500 text-[#111827]">{product.title}</p>
        <p className="mt-1 truncate t-caption text-[#6b7280]">{seller?.name}</p>
      </Link>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div><p className="t-16 t-w-700 text-[#111827]">${product.price.toFixed(2)}</p><p className="t-caption text-[#6b7280] line-through">${product.originalPrice?.toFixed(2)}</p></div>
        <span className="rounded-none bg-[#fff1f2] px-2 py-1 t-badge t-w-700 text-[#dc2626]">{timer}</span>
      </div>
      <div className="mt-3"><div className="h-1.5 overflow-hidden rounded-none bg-[#fee2e2]"><div className="h-full rounded-none bg-[#ef4444]" style={{ width: `${stockPercent}%` }} /></div><p className="mt-1 t-badge t-w-500 text-[#dc2626]">Only {product.stockLeft} left</p></div>
    </li>
  );
}

export function FlashSaleShelf() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-none bg-[#fff1f2] p-4 sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-4"><div><p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#dc2626]">Ends soon</p><h2 className="mt-1 t-title-block t-w-700 tracking-[-0.04em] text-[#111827]">Flash Sale</h2></div><Link href="/search?sale=true" className="t-body t-w-700 text-[#dc2626]">See all</Link></div>
        <div className="hide-scrollbar overflow-x-auto"><ul className="flex gap-4 pb-1">{flashSaleProducts.map((product) => <SaleCard key={product.id} product={product} />)}</ul></div>
      </div>
    </section>
  );
}
