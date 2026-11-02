import Image from "@/components/ui/safe-image";
import Link from "next/link";
import { Card } from "@/components/home/product-card";
import { HoverRail } from "@/components/category/hover-rail";
import { ImageTile } from "@/components/category/image-tile";
import { categoryGroupMap, getCategoryLabel } from "@/data/products";
import { DEFAULT_TILE_IMAGE, brandImage, subcategoryImage } from "@/data/tile-images";
import { SellerPhotoCard, SellerPhotoGrid } from "@/components/marketplace/seller-photo-grid";
import { ProductFeed } from "@/components/grid/product-feed";
import { Discovery } from "@/components/discovery/discovery";
import { getTopDeals, marketplaceProducts, officialStoreSellerIds, sellers } from "@/lib/mock/marketplace";

const BANNER_COLORS = ["#0b6e78", "#0f766e", "#b45309", "#7c3aed", "#be123c", "#0b6e78", "#15803d", "#0e7490", "#a21caf", "#4d7c0f", "#c2410c", "#334155"];

export function OfficialStores() {
  const stores = sellers
    .filter((s) => officialStoreSellerIds.has(s.id))
    .map((seller, i) => ({
      seller,
      color: BANNER_COLORS[i % BANNER_COLORS.length],
      items: marketplaceProducts.filter((p) => p.sellerId === seller.id),
    }));
  const all = stores.flatMap((s) => s.items);
  const hero = all[0];
  const flash = all.filter((p) => p.flashSale);
  const byCategory = Array.from(new Set(all.map((p) => p.category))).map((category) => ({
    category,
    items: all.filter((p) => p.category === category),
  }));

  const group = categoryGroupMap.get("official-store");
  const subs = group?.subCategories ?? [];
  const brands = group?.subGroups?.find((g) => g.title === "Top Brands")?.links ?? [];

  return (
    <div className="gs mx-auto w-full max-w-[1400px] px-4 py-4 text-[#111827] sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 pb-2 t-caption text-[#6b7280]">
        <Link href="/" className="hover:text-[#087f8c]">Home</Link>
        <span aria-hidden="true">/</span>
        <b className="text-[#087f8c]">Official Stores</b>
        <span className="ml-auto">{stores.length} stores</span>
      </nav>

      <header className="relative overflow-hidden bg-[#0b6e78] text-white">
        {hero && <Image src={hero.image} alt="" fill preload sizes="100vw" className="object-cover opacity-35" />}
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <p className="t-caption t-w-700 uppercase tracking-[0.2em] text-white/80">100% authentic</p>
          <h1 className="mt-2 t-hero t-w-700 tracking-[-0.03em] sm:t-hero">Official Stores</h1>
          <p className="mt-2 max-w-md t-body text-white/90">Shop directly from verified brands and General Store Official, with genuine products and free returns.</p>
        </div>
      </header>

      <section className="my-5 border border-[#e5e7eb] bg-white" aria-labelledby="stores-title">
        <div className="border-b border-[#e5e7eb] px-4 py-3"><h2 id="stores-title" className="t-title-section t-w-700">Shop by official store</h2></div>
        <SellerPhotoGrid className="seller-photo-grid--top-sellers p-4">
          {stores.map(({ seller, items }) => (
            <SellerPhotoCard
              key={seller.id}
              seller={seller}
              image={items[0]?.image ?? seller.avatar}
              bannerTitle="Official store"
              bannerSubtitle={seller.category}
              verified
              badge="Official"
              details={<span><em>★</em> {seller.rating.toFixed(1)} · {seller.totalProducts} products</span>}
              footer={<Link href={`/seller/${seller.id}`} className="t-body t-w-700 text-[#087f8c]">Visit store</Link>}
              bannerAspect="wide"
              imageFit="cover"
            />
          ))}
        </SellerPhotoGrid>
      </section>

      {subs.length > 0 && (
        <section className="my-5 overflow-hidden border border-[#e5e7eb] bg-white">
          <div className="border-b border-[#e5e7eb] px-4 py-3"><h2 className="t-title-section t-w-700">Shop by collection</h2></div>
          <div className="image-grid-gap grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {subs.map((sub) => (
              <ImageTile key={sub.slug} href={`/search/official-store/${sub.slug}`} title={sub.title} image={subcategoryImage(sub.slug) ?? DEFAULT_TILE_IMAGE} />
            ))}
          </div>
        </section>
      )}

      {brands.length > 0 && (
        <section className="my-5 overflow-hidden border border-[#e5e7eb] bg-white">
          <div className="border-b border-[#e5e7eb] px-4 py-3"><h2 className="t-title-section t-w-700">Top brands</h2></div>
          <div className="image-grid-gap grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {brands.map((brand) => (
              <ImageTile key={brand.title} href={`/search?q=${encodeURIComponent(brand.title)}`} title={brand.title} image={brandImage(brand.title) ?? DEFAULT_TILE_IMAGE} />
            ))}
          </div>
        </section>
      )}

      {flash.length > 0 && (
        <section className="my-5 overflow-hidden border border-[#e5e7eb] bg-white">
          <div className="bg-[#087f8c] px-4 py-3 text-white"><h2 className="t-title-section t-w-700">Top deals</h2></div>
          <HoverRail>
            {flash.map((p) => (
              <li key={p.id} className="w-[200px] flex-none snap-start border-r border-[#e5e7eb] sm:w-[220px] lg:w-[calc((100%-90px)/6)]">
                <Card p={p} flash />
              </li>
            ))}
          </HoverRail>
        </section>
      )}

      {stores.filter((s) => s.items.length > 0).map(({ seller, color, items }) => {
        const sellerDeals = getTopDeals(items); // always a full row of 6 per brand
        return (
          <section key={seller.id} className="my-5 overflow-hidden border border-[#e5e7eb] bg-white">
            <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: color }}>
              <span className="flex h-9 w-9 items-center justify-center bg-white/20 t-w-700">{seller.name.charAt(0)}</span>
              <h2 className="t-card-name t-w-700">{seller.name}</h2>
              <Link href={`/seller/${seller.id}`} className="ml-auto inline-flex items-center gap-1 t-body t-w-500">
                Visit store
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
              </Link>
            </div>
            {sellerDeals.length > 0 && (
              <>
                <div className="border-b border-[#e5e7eb] bg-[#eaf9fa] px-4 py-2 t-body-strong text-[#0b6e78]">Top deals from {seller.name}</div>
                <HoverRail>
                  {sellerDeals.map((product) => (
                    <li key={product.id} className="w-[200px] flex-none snap-start border-r border-[#e5e7eb] bg-white sm:w-[220px] lg:w-[calc((100%-90px)/6)]">
                      <Card p={product} flash={product.flashSale} />
                    </li>
                  ))}
                </HoverRail>
              </>
            )}
            <div className="border-y border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 t-body-strong text-[#374151]">All products from {seller.name} ({items.length})</div>
            <div className="p-4">
              <ProductFeed products={items} />
            </div>
          </section>
        );
      })}

      {byCategory.length > 1 && (
        <section className="my-5 border border-[#e5e7eb] bg-white">
          <div className="border-b border-[#e5e7eb] px-4 py-3"><h2 className="t-title-section t-w-700">Official stores by category</h2></div>
          <ul className="flex flex-wrap gap-2 p-4">
            {byCategory.map(({ category, items }) => (
              <li key={category}>
                <Link href={`/search/${category}`} className="inline-block border border-[#e5e7eb] px-4 py-2 t-body hover:border-[#087f8c] hover:text-[#087f8c]">
                  {getCategoryLabel(category)} ({items.length})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Discovery bare sections={["searched", "viewed", "trending"]} />
    </div>
  );
}
