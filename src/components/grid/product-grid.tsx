import { Product } from "@/data/products";
import Image from "@/components/ui/safe-image";
import { Card } from "@/components/home/product-card";
import { HoverRail } from "@/components/category/hover-rail";
import { marketplaceProducts } from "@/lib/mock/marketplace";
import { ProductFeed } from "./product-feed";

export function ProductGrid({ products, title = "All products", description }: { products: Product[]; title?: string; description?: string }) {
  const matchedDeals = marketplaceProducts.filter((product) => product.flashSale && products.some((item) => item.id === product.id));
  const topDeals = matchedDeals.length ? matchedDeals : marketplaceProducts.filter((product) => product.isOfficialStore && product.flashSale).slice(0, 12);
  const heroProduct = products[0] ?? topDeals[0];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="relative isolate mb-8 overflow-hidden bg-[#0b6e78] text-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
        {heroProduct && <Image src={heroProduct.image} alt="" fill preload sizes="100vw" className="object-cover opacity-35" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b6e78] via-[#0b6e78]/90 to-[#0b6e78]/35" aria-hidden="true" />
        <div className="relative flex min-h-[240px] flex-col justify-between gap-6 p-5 sm:min-h-[280px] sm:flex-row sm:items-end sm:p-8">
          <div className="max-w-2xl">
            <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-white/80">Official store · featured collection</p>
            <h1 className="mt-1 t-hero t-w-700 tracking-[-0.04em] text-white">{title}</h1>
            <p className="mt-3 t-body text-white/90">{description || "Explore our latest collection and shop special offers from trusted official stores."}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex bg-white/15 px-3 py-2 t-caption t-w-500 text-white">{products.length} products</span>
            <a href="#official-products" className="inline-flex min-h-11 items-center justify-center bg-white px-5 t-body t-w-700 text-[#0b6e78] hover:bg-[#eaf9fa]">Shop collection</a>
          </div>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-none border border-[#e5e7eb] bg-white p-3 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
        <span className="rounded-none bg-[#eaf9fa] px-3 py-1.5 t-caption t-w-500 text-[#087f8c]">Top picks</span>
        <span className="rounded-none px-3 py-1.5 t-caption t-w-500 text-[#4b5563]">Fast delivery</span>
        <span className="rounded-none px-3 py-1.5 t-caption t-w-500 text-[#4b5563]">New arrivals</span>
        <span className="rounded-none px-3 py-1.5 t-caption t-w-500 text-[#4b5563]">Best sellers</span>
      </div>

      {topDeals.length > 0 && (
        <section className="mb-6 overflow-hidden border border-[#e5e7eb] bg-white" aria-labelledby="official-top-deals">
          <div className="bg-[#087f8c] px-4 py-3 text-white"><h2 id="official-top-deals" className="t-title-section t-w-700">Top deals</h2></div>
          <HoverRail>
            {topDeals.map((product) => (
              <li key={product.id} className="w-[200px] flex-none snap-start border-r border-[#e5e7eb] bg-white sm:w-[220px] lg:w-[calc((100%-90px)/6)]">
                <Card p={product} flash />
              </li>
            ))}
          </HoverRail>
        </section>
      )}

      <ProductFeed id="official-products" products={products} />
    </div>
  );
}
