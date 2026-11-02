import { getProductsByCategory } from "@/data/products";
import { ProductCard } from "@/components/grid/product-card";
import Link from "next/link";

export function Carousel() {
  const categories = ["shirts", "bags", "drinkware", "hoodies", "kids", "headwear"];
  const products = categories
    .map((category) => getProductsByCategory(category)[0])
    .filter(Boolean);
  if (!products.length) return null;

  return (
    <section aria-labelledby="featured-edit" className="w-full overflow-hidden pb-10 pt-2">
      <div className="mx-auto max-w-[1400px] px-4 pb-4 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="t-caption t-w-500 uppercase tracking-[0.18em] text-[#6b7280]">Curated for you</p>
            <h2 id="featured-edit" className="mt-1 t-title-block t-w-700 tracking-[-0.04em] text-[#111827] sm:t-hero">The latest edit</h2>
          </div>
          <Link href="/search" className="hidden t-body t-w-500 text-[#087f8c] hover:text-[#0b6e78] sm:block">Explore more</Link>
        </div>
      </div>

      <div className="hide-scrollbar overflow-x-auto pb-2">
        <ul className="image-card-rail flex w-max px-4 hover:[animation-play-state:paused] lg:px-6">
          {products.map((product) => (
            <li
              key={product.handle}
              className="relative h-[270px] w-[240px] flex-none overflow-hidden rounded-none border border-[#e5e7eb] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.04)] md:h-[320px] md:w-[290px]"
            >
              <ProductCard product={product} showDetails={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
