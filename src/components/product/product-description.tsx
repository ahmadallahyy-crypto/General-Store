"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/components/cart/cart-context";
import { getMarketplaceProduct, getSeller } from "@/lib/mock/marketplace";

const COLORS = ["Black", "Blue", "Gray", "Pink", "White"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductDescription({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  const marketplaceProduct = getMarketplaceProduct(product.id);
  const seller = marketplaceProduct ? getSeller(marketplaceProduct.sellerId) : undefined;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="rounded-none border border-[#e5e7eb] bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="mb-6 flex flex-col border-b border-[#e5e7eb] pb-6">
        <p className="mb-3 t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">
          Crafted essentials
        </p>
        <h1 className="mb-3 t-hero t-w-700 tracking-[-0.05em] text-[#111827] sm:t-hero">
          {product.title}
        </h1>
        {marketplaceProduct && (
          <div className="mb-3 flex flex-wrap items-center gap-2 t-body">
            <span className="t-w-700 text-[#d97706]">★ {marketplaceProduct.rating}</span>
            <span className="text-[#6b7280]">({marketplaceProduct.reviewCount.toLocaleString()} reviews)</span>
            {marketplaceProduct.isOfficialStore && <span className="rounded-none bg-[#111827] px-1.5 py-0.5 t-badge t-w-700 uppercase tracking-wide text-white">Official Store</span>}
            {marketplaceProduct.isExpress && <span className="rounded-none bg-[#087f8c] px-1.5 py-0.5 t-badge t-w-700 uppercase tracking-wide text-white">Express</span>}
          </div>
        )}
        <div className="mr-auto flex items-center gap-2">
          <div className="rounded-none bg-[#eaf9fa] px-4 py-2 t-body t-w-700 text-[#087f8c] shadow-sm">
            <p>
              ${product.price.toFixed(2)}{" "}
              <span className="ml-1 inline">{product.currency}</span>
            </p>
          </div>
          {marketplaceProduct?.originalPrice && (
            <span className="t-body text-[#6b7280] line-through">${marketplaceProduct.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      {seller && marketplaceProduct && (
        <Link
          href={`/seller/${seller.id}`}
          className="mb-6 flex items-center gap-3 rounded-none border border-[#e5e7eb] bg-[#f9fafb] p-3 transition hover:border-[#087f8c]"
        >
          <Image src={seller.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-none object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate t-body t-w-700 text-[#111827]">{seller.name}</p>
            <p className="t-caption text-[#6b7280]">★ {seller.rating} · {seller.responseRate}% response rate</p>
          </div>
          <span className="shrink-0 t-caption t-w-700 text-[#087f8c]">Visit shop</span>
        </Link>
      )}

      {marketplaceProduct && (
        <div className="mb-6 t-caption t-w-500 text-[#374151]">
          {marketplaceProduct.delivery === "Same-day" ? "Same-day delivery" : `Ships in ${marketplaceProduct.delivery === "1-2 days" ? "1-2 days" : "3-5 days"}`}
          {marketplaceProduct.freeShipping && <span className="text-[#16a34a]"> · Free shipping</span>}
          {marketplaceProduct.flashSale && <span className="text-[#dc2626]"> · Only {marketplaceProduct.stockLeft} left</span>}
        </div>
      )}

      <div className="mb-6">
        <p className="mb-2 t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`rounded-none border px-3 py-1.5 t-body transition ${
                color === c
                  ? "border-[#087f8c] bg-[#eaf9fa] text-[#111827]"
                  : "border-[#e5e7eb] bg-[#f9fafb] text-[#4b5563]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-none border px-3 py-1.5 t-body transition ${
                size === s
                  ? "border-[#087f8c] bg-[#eaf9fa] text-[#111827]"
                  : "border-[#e5e7eb] bg-[#f9fafb] text-[#4b5563]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 t-body leading-relaxed text-[#4b5563]">
        {product.description}
      </div>

      {marketplaceProduct && (
        <div className="mb-6 rounded-none border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="mb-3 t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">Rating breakdown</p>
          <div className="space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <div key={star} className="flex items-center gap-2 t-caption text-[#6b7280]">
                <span className="w-8 shrink-0">{star}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-none bg-[#e5e7eb]">
                  <div className="h-full rounded-none bg-[#f59e0b]" style={{ width: `${marketplaceProduct.ratingBreakdown[star]}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right">{marketplaceProduct.ratingBreakdown[star]}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        className="relative flex w-full items-center justify-center rounded-none bg-[#dc2626] p-4 t-body t-w-700 tracking-[0.12em] text-white shadow-[0_16px_28px_rgba(220,38,38,0.18)] transition hover:bg-[#b91c1c]"
      >
        <div className="absolute left-0 ml-5">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        {added ? "Added to Cart ✓" : "Add To Cart"}
      </button>
    </div>
  );
}
