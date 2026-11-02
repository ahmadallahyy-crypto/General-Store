"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import Label, { ProductMeta } from "@/components/label";
import { AddToCart } from "@/components/product/add-to-cart";
import { Product } from "@/data/products";
import { getMarketplaceProduct, getSeller } from "@/lib/mock/marketplace";
import { useWishlist } from "@/components/wishlist/wishlist-context";

export function ProductCard({
  product,
  preload = false,
  size = "default",
  labelPosition = "bottom",
  showDetails = true,
}: {
  product: Product;
  preload?: boolean;
  size?: "default" | "large";
  labelPosition?: "bottom" | "center";
  showDetails?: boolean;
}) {
  const marketplaceProduct = getMarketplaceProduct(product.id);
  const seller = marketplaceProduct ? getSeller(marketplaceProduct.sellerId) : undefined;
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(product.id);

  if (!showDetails) {
    return (
      <Link
        href={`/product/${product.handle}`}
        className="relative block aspect-square h-full w-full"
        prefetch={true}
      >
        <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-none border border-[#e5e7eb] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#087f8c]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            preload={preload}
            className="relative h-full w-full object-contain p-2 transition duration-500 ease-out group-hover:scale-[1.03] sm:p-3"
            sizes={size === "large" ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          />
          <Label
            title={product.title}
            amount={product.price.toFixed(2)}
            currencyCode={product.currency}
            position={labelPosition}
          />
        </div>
      </Link>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-none border border-[var(--border)] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-strong)]">
      <Link href={`/product/${product.handle}`} className="block" prefetch={true}>
        <div className="relative aspect-square w-full overflow-hidden bg-[#fafafa]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              preload={preload}
              className={clsx(
                "relative h-full w-full object-contain p-3 sm:p-4",
                "transition duration-500 ease-out group-hover:scale-[1.03]"
              )}
              sizes={
                size === "large"
                  ? "(min-width: 768px) 55vw, 100vw"
                  : "(min-width: 768px) 30vw, 50vw"
              }
            />
          ) : null}
          {marketplaceProduct?.flashSale && (
            <span className="absolute left-3 top-3 rounded-none bg-[#dc2626] px-2 py-1 t-badge t-w-700 uppercase tracking-wide text-white">Sale</span>
          )}
        </div>
      </Link>
      <button
        type="button"
        aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title}`}
        aria-pressed={saved}
        onClick={(event) => {
          event.preventDefault();
          toggleWishlist(product);
        }}
        className={clsx(
          "absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-none border bg-white/90 shadow-sm transition",
          saved ? "border-[#087f8c] text-[#087f8c]" : "border-[#e5e7eb] text-[#111827] hover:bg-[#f8fbff]"
        )}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current stroke-[1.8]" fill={saved ? "currentColor" : "none"} aria-hidden="true">
          <path d="M12 20.5 4.5 12.5A4.2 4.2 0 0 1 12 6.1a4.2 4.2 0 0 1 7.5 6.4L12 20.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="space-y-1.5 p-2.5 sm:p-3.5">
        <Link href={`/product/${product.handle}`} className="block min-w-0" prefetch={true}>

          <ProductMeta
            title={product.title}
            amount={product.price.toFixed(2)}
            currencyCode={product.currency}
          />
        </Link>
        {seller && marketplaceProduct && (
          <div className="flex items-center justify-between gap-2 t-caption text-[#6b7280]">
            <span className="truncate t-w-500 text-[#374151]">{seller.name}</span>
            <span className="shrink-0 t-w-700 text-[#d97706]">★ {marketplaceProduct.rating}</span>
          </div>
        )}
        {marketplaceProduct && (marketplaceProduct.isOfficialStore || marketplaceProduct.isExpress) && (
          <div className="flex flex-wrap gap-1">
            {marketplaceProduct.isOfficialStore && <span className="rounded-none bg-[#111827] px-1.5 py-0.5 t-badge t-w-700 uppercase tracking-wide text-white">Official Store</span>}
            {marketplaceProduct.isExpress && <span className="rounded-none bg-[#087f8c] px-1.5 py-0.5 t-badge t-w-700 uppercase tracking-wide text-white">Express</span>}
          </div>
        )}
        {marketplaceProduct && (
          <div className="flex items-center justify-between gap-2 t-caption text-[#6b7280]">
            <span>{marketplaceProduct.delivery === "Same-day" ? "Same-day delivery" : `Ships in ${marketplaceProduct.delivery === "1-2 days" ? "1-2 days" : "3-5 days"}`}</span>
            {marketplaceProduct.flashSale && <span className="t-w-500 text-[#dc2626]">Only {marketplaceProduct.stockLeft} left</span>}
          </div>
        )}
        <AddToCart product={product} compact />
      </div>
    </article>
  );
}
