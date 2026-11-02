"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { products, type Product } from "@/data/products";
import { FlashSaleHeader } from "./redline-sections";
import { useWishlist } from "@/components/wishlist/wishlist-context";

function Section({
  title,
  subtitle,
  items,
  badge,
  flash = false,
}: {
  title: string;
  subtitle: string;
  items: Product[];
  badge: string;
  flash?: boolean;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <section className="w-full border-t border-[#e5e7eb] pt-8">
      {flash && <FlashSaleHeader />}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">{subtitle}</p>
          <h2 className="mt-1 t-title-block t-w-700 tracking-[-0.04em] text-[#111827] sm:t-hero">{title}</h2>
        </div>
        <Link href="/search" className="hidden t-body t-w-500 text-[#087f8c] hover:text-[#0b6e78] sm:block">
          See all
        </Link>
      </div>

      <div className="hide-scrollbar overflow-x-auto">
        <ul className="image-card-rail flex w-max pb-1">
          {items.map((item) => {
            const oldPrice = item.price * 1.45;
            const discount = Math.max(8, Math.round(((oldPrice - item.price) / oldPrice) * 100));
            const saved = isWishlisted(item.id);

            return (
              <li key={item.handle} className="w-[220px] flex-none sm:w-[240px]">
                <article className="group overflow-hidden rounded-none border border-[#e5e7eb] bg-white shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#087f8c]">
                  <div className="relative border-b border-[#f1f5f9]">
                    <button
                      type="button"
                      aria-label={saved ? `Remove ${item.title} from wishlist` : `Save ${item.title}`}
                      aria-pressed={saved}
                      onClick={() => toggleWishlist(item)}
                      className={clsx(
                        "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-none border bg-white/90 shadow-sm transition",
                        saved ? "border-[#087f8c] text-[#087f8c]" : "border-[#e5e7eb] text-[#111827] hover:bg-[#f8fbff]"
                      )}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current stroke-[1.8]" fill={saved ? "currentColor" : "none"} aria-hidden="true">
                        <path d="M12 20.5 4.5 12.5A4.2 4.2 0 0 1 12 6.1a4.2 4.2 0 0 1 7.5 6.4L12 20.5Z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <Link href={`/product/${item.handle}`} className="block" prefetch={true}>
                      <div className="relative aspect-square overflow-hidden bg-[#f8fafc]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-3 transition duration-500 ease-out group-hover:scale-[1.03]"
                          sizes="(min-width: 768px) 220px, 55vw"
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="space-y-2 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/product/${item.handle}`} className="block min-w-0" prefetch={true}>
                        <p className="truncate t-body t-w-500 text-[#111827]">{item.title}</p>
                      </Link>
                      <span className="rounded-none bg-[#eaf9fa] px-2 py-1 t-badge t-w-500 uppercase tracking-[0.12em] text-[#087f8c]">
                        {badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 t-body">
                      <span className="t-16 t-w-700 text-[#111827]">${item.price.toFixed(2)}</span>
                      <span className="t-caption text-[#6b7280] line-through">${oldPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-none bg-[#fef2f2] px-2 py-1 t-badge t-w-700 text-[#dc2626]">-{discount}%</span>
                      <Link
                        href={`/product/${item.handle}`}
                        className="rounded-none border border-[#e2f7f9] bg-[#eaf9fa] px-2.5 py-1.5 t-badge t-w-700 uppercase tracking-[0.12em] text-[#087f8c] transition hover:bg-[#e2f7f9]"
                        prefetch={true}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function HomeSections() {
  const trending = products.slice(0, 6);
  const wishlist = products.slice(1, 7);
  const recentlyViewed = products.slice(2, 8);

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-4 pb-14 pt-8 lg:px-6">
      <Section title="Flash Sales" subtitle="Limited time" items={trending} badge="Hot" flash />
      <Section title="Trending now" subtitle="Popular picks" items={recentlyViewed} badge="New" />
      <Section title="Saved for later" subtitle="Wishlist" items={wishlist} badge="Save" />
    </div>
  );
}
