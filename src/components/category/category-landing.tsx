import { ProductFeed } from "@/components/grid/product-feed";
import { Discovery } from "@/components/discovery/discovery";
import Image from "@/components/ui/safe-image";
import Link from "next/link";
import { Card } from "@/components/home/product-card";
import { HoverRail } from "@/components/category/hover-rail";
import { ImageTile } from "@/components/category/image-tile";
import { DEFAULT_TILE_IMAGE, brandImage, subcategoryImage } from "@/data/tile-images";
import { categoryGroupMap, getCategoryLabel, type Product } from "@/data/products";
import { marketplaceProducts } from "@/lib/mock/marketplace";

const sortOptions = [
  { value: "", label: "Popularity" },
  { value: "latest-desc", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function SectionHead({ title, href, tone = "plain" }: { title: string; href: string; tone?: "plain" | "deal" }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${tone === "deal" ? "bg-[#087f8c] text-white" : "border-b border-[#e5e7eb]"}`}>
      <h2 className="t-title-section t-w-700">{title}</h2>
      <Link href={href} className={`inline-flex items-center gap-1 t-body t-w-500 ${tone === "deal" ? "text-white" : "text-[#087f8c]"}`}>
        See all
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
      </Link>
    </div>
  );
}

const market = new Map(marketplaceProducts.map((p) => [p.id, p]));
const flash = new Set(marketplaceProducts.filter((p) => p.flashSale).map((p) => p.id));

function ProductRail({ title, href, items, tone }: { title: string; href: string; items: Product[]; tone?: "plain" | "deal" }) {
  if (items.length === 0) return null;
  return (
    <section className="my-5 overflow-hidden border border-[#e5e7eb] bg-white">
      <SectionHead title={title} href={href} tone={tone} />
      <HoverRail>
        {items.map((product) => (
          <li key={product.id} className="w-[200px] flex-none snap-start border-b border-r border-[#e5e7eb] bg-white sm:w-[220px] lg:w-[calc((100%-90px)/6)]">
            <Card p={market.get(product.id)!} flash={flash.has(product.id)} />
          </li>
        ))}
      </HoverRail>
    </section>
  );
}

export function CategoryLanding({
  collection,
  products,
  sort,
  title,
  description,
  heroImage,
}: {
  collection: string;
  products: Product[];
  sort?: string;
  title?: string;
  description?: string;
  heroImage?: string;
}) {
  const label = getCategoryLabel(collection);
  const pageTitle = title ?? label;
  const isSubcategory = pageTitle !== label;
  const group = categoryGroupMap.get(collection.toLowerCase());
  const base = `/search/${collection}`;
  const ids = new Set(products.map((p) => p.id));

  const byNewest = [...products].sort((a, b) => Number(b.id) - Number(a.id));
  const flashDeals = products.filter((p) => flash.has(p.id));
  const cheapest = [...products].sort((a, b) => a.price - b.price).filter((p) => !flash.has(p.id));
  const deals = [...flashDeals, ...cheapest].slice(0, 12);
  const newest = byNewest.slice(0, 12);
  const rating = new Map(marketplaceProducts.map((p) => [p.id, p.rating]));
  const bestSellers = [...products].sort((a, b) => (rating.get(b.id) ?? 0) - (rating.get(a.id) ?? 0)).slice(0, 12);

  const topBrandLinks = group?.subGroups?.find((g) => g.title === "Top Brands")?.links ?? [];
  const brands = (topBrandLinks.length > 0
    ? topBrandLinks.map((entry) => ({
      title: entry.title,
      slug: entry.slug,
      image: entry.image,
    }))
    : Array.from(new Set(marketplaceProducts.filter((p) => ids.has(p.id)).map((p) => p.brand))).map((brand) => ({
      title: brand,
      slug: "",
      image: undefined,
    }))
  ).slice(0, 12);

  const subs = group?.subCategories ?? [];
  const fallbackImage = (i: number) => products[i % Math.max(products.length, 1)]?.image ?? DEFAULT_TILE_IMAGE;
  const bannerImage = heroImage ?? products[0]?.image ?? (products.length > 0 ? subcategoryImage(subs[0]?.slug ?? "") ?? DEFAULT_TILE_IMAGE : undefined);
  const sorted = (() => {
    switch (sort) {
      case "price-asc": return [...products].sort((a, b) => a.price - b.price);
      case "price-desc": return [...products].sort((a, b) => b.price - a.price);
      case "latest-desc": return byNewest;
      default: return products;
    }
  })();

  return (
    <div className="gs mx-auto w-full max-w-[1400px] px-4 py-4 text-[#111827] sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 pb-2 t-caption text-[#6b7280]">
        <Link href="/" className="hover:text-[#087f8c]">Home</Link>
        <span aria-hidden="true">/</span>
        {pageTitle !== label ? <><Link href={base} className="hover:text-[#087f8c]">{label}</Link><span aria-hidden="true">/</span></> : null}
        <b className="text-[#087f8c]">{pageTitle}</b>
        <span className="ml-auto">{products.length} products</span>
      </nav>

      <header className="relative isolate overflow-hidden bg-[#0b6e78] p-6 text-white sm:p-8">
        {bannerImage && (
          <>
            <Image src={bannerImage} alt="" fill preload sizes="(max-width: 768px) 100vw, 1400px" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b6e78]/95 via-[#0b6e78]/85 to-[#0b6e78]/55" aria-hidden="true" />
          </>
        )}
        <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-white/80">Shop the collection</p>
        <h1 className={`mt-1 ${isSubcategory ? "t-title-subcategory" : "t-title-page"} t-w-700 tracking-[-0.03em]`}>{pageTitle}</h1>
        <p className="mt-1 max-w-2xl t-body text-white/90">{description ?? (products.length > 0 ? `Top deals, new arrivals and best sellers in ${label}.` : `No ${label.toLowerCase()} products are listed yet. Check back soon.`)}</p>
      </header>

      {subs.length > 0 && (
        <section className="my-5 overflow-hidden border border-[#e5e7eb] bg-white">
          <div className="border-b border-[#e5e7eb] px-4 py-3"><h2 className="t-title-section t-w-700">Shop by sub-category</h2></div>
          <div className="image-grid-gap grid grid-cols-2 bg-white sm:grid-cols-3 lg:grid-cols-6">
            {subs.map((sub, i) => (
              <ImageTile key={sub.slug} href={`${base}/${sub.slug}`} title={sub.title} image={sub.image ?? subcategoryImage(sub.slug) ?? fallbackImage(i)} />
            ))}
          </div>
        </section>
      )}

      <ProductRail title={`Top deals in ${pageTitle}`} href={`${base}?sort=price-asc`} items={deals} tone="deal" />
      <ProductRail title="New arrivals" href={`${base}?sort=latest-desc`} items={newest} />
      <ProductRail title="Best sellers" href={base} items={bestSellers} />

      {brands.length > 0 && (
        <section className="my-5 overflow-hidden border border-[#e5e7eb] bg-white">
          <div className="border-b border-[#e5e7eb] px-4 py-3"><h2 className="t-title-section t-w-700">Top brands</h2></div>
          <div className="image-grid-gap grid grid-cols-2 bg-white sm:grid-cols-3 lg:grid-cols-6">
            {brands.map((brand, i) => (
              <ImageTile
                key={brand.title}
                href={`/search?q=${encodeURIComponent(brand.title)}`}
                title={brand.title}
                image={brand.image ?? brandImage(brand.title) ?? fallbackImage(i + 3)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="my-5">
        <section className="border border-[#e5e7eb] bg-white" aria-labelledby="all-products">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7eb] px-4 py-3">
            <h2 id="all-products" className="t-title-section t-w-700">All {pageTitle}</h2>
            <small className="text-[#6b7280]">{products.length} products found</small>
          </div>
          <nav aria-label="Sort and sub-category" className="flex items-center gap-1 overflow-x-auto border-b border-[#e5e7eb] px-2 t-body [scrollbar-width:none]">
            <span className="px-2 t-caption t-w-700 uppercase text-[#6b7280]">Sort</span>
            {sortOptions.map((option) => {
              const active = (sort ?? "") === option.value;
              return (
                <Link
                  key={option.label}
                  href={option.value ? `${base}?sort=${option.value}` : base}
                  aria-current={active ? "true" : undefined}
                  className={`whitespace-nowrap border-b-2 px-3 py-3 ${active ? "border-[#087f8c] t-w-500 text-[#087f8c]" : "border-transparent text-[#374151] hover:text-[#087f8c]"}`}
                >
                  {option.label}
                </Link>
              );
            })}
            {subs.length > 0 && <span className="mx-2 h-5 w-px flex-none bg-[#e5e7eb]" aria-hidden="true" />}
            {subs.map((sub) => (
              <Link key={sub.slug} href={`${base}/${sub.slug}`} className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-[#374151] hover:text-[#087f8c]">
                {sub.title}
              </Link>
            ))}
          </nav>
          {sorted.length === 0 ? (
            <p className="p-8 text-center t-body text-[#6b7280]">No products in this category yet.</p>
          ) : (
            <div className="p-4">
              <ProductFeed products={sorted} />
            </div>
          )}
        </section>
      </div>

      {/* Always something to browse: recent searches, recently viewed, trending (fills thin pages) */}
      <Discovery bare excludeIds={products.map((item) => item.id)} />
    </div>
  );
}
