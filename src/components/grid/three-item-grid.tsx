import { getCollectionProducts, Product } from "@/data/products";
import { ProductCard } from "./product-card";
import Link from "next/link";

function ThreeItemGridItem({
  product,
  size,
  preload,
}: {
  product: Product;
  size: "full" | "half";
  preload?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <div className="h-full w-full overflow-hidden rounded-none border border-[#e5e7eb] bg-white shadow-[0_16px_30px_rgba(15,23,42,0.04)]">
        <ProductCard
          product={product}
          preload={preload}
          size={size === "full" ? "large" : "default"}
          labelPosition={size === "full" ? "center" : "bottom"}
          showDetails={false}
        />
      </div>
    </div>
  );
}

export function ThreeItemGrid() {
  const [first, second, third] = getCollectionProducts(
    "hidden-homepage-featured-items"
  );
  if (!first || !second || !third) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-8 pt-6 sm:px-4 lg:px-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">Top picks</p>
          <h2 className="mt-1 t-title-block t-w-700 tracking-[-0.04em] text-[#111827] sm:t-hero">Featured collections</h2>
        </div>
        <Link href="/search" className="hidden t-body t-w-500 text-[#087f8c] hover:text-[#0b6e78] sm:block">See all</Link>
      </div>

      <div className="image-grid-gap grid md:grid-cols-6 md:grid-rows-2">
        <ThreeItemGridItem size="full" product={first} preload />
        <ThreeItemGridItem size="half" product={second} preload />
        <ThreeItemGridItem size="half" product={third} />
      </div>
    </section>
  );
}
