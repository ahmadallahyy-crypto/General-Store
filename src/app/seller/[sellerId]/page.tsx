import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "@/components/ui/safe-image";
import Link from "next/link";
import { Card } from "@/components/home/product-card";
import { HoverRail } from "@/components/category/hover-rail";
import { Discovery } from "@/components/discovery/discovery";
import { ProductFeed } from "@/components/grid/product-feed";
import { FollowButton } from "@/components/marketplace/follow-button";
import { getSeller, getTopDeals, marketplaceProducts, officialStoreSellerIds, sellers } from "@/lib/mock/marketplace";

export function generateStaticParams() {
  return sellers.map((seller) => ({ sellerId: seller.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ sellerId: string }> }): Promise<Metadata> {
  const { sellerId } = await params;
  const seller = getSeller(sellerId);
  if (!seller) return { title: "Seller not found" };
  return {
    title: seller.name,
    description: `Shop ${seller.category.toLowerCase()} products from ${seller.name}. ${seller.rating} rating, ${seller.totalProducts.toLocaleString()} products.`,
  };
}

export default async function SellerShopPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  const seller = getSeller(sellerId);
  if (!seller) notFound();

  const products = marketplaceProducts.filter((product) => product.sellerId === seller.id);
  const topDeals = getTopDeals(products); // flash sales first, filled to a full row of 6
  const heroProduct = topDeals[0] ?? products[0];

  return (
    <>
    <div className="gs mx-auto max-w-[1400px] px-4 py-8 text-[#111827] sm:px-6 lg:px-8">
      <section className="relative isolate mb-6 overflow-hidden bg-[#0b6e78] text-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]" aria-label={`${seller.name} store promotion`}>
        {heroProduct && <Image src={heroProduct.image} alt="" fill preload sizes="100vw" className="object-cover opacity-35" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b6e78] via-[#0b6e78]/90 to-[#0b6e78]/35" aria-hidden="true" />
        <div className="relative flex min-h-[260px] flex-col justify-between gap-8 p-6 sm:min-h-[300px] sm:flex-row sm:items-end sm:p-10">
          <div className="max-w-2xl">
            <p className="t-caption t-w-700 uppercase tracking-[0.2em] text-white/80">{seller.verified || officialStoreSellerIds.has(seller.id) ? "Official store" : "Seller storefront"}</p>
            <h1 className="mt-2 t-hero t-w-700 tracking-[-0.04em] text-white">{seller.name}</h1>
            <p className="mt-2 max-w-xl t-body text-white/90">Shop {seller.category.toLowerCase()} favorites, discover special offers, and explore the latest picks from {seller.name}.</p>
            <p className="mt-3 t-caption text-white/80">{seller.rating} rating · {seller.followers.toLocaleString()} followers · {seller.totalProducts.toLocaleString()} products · {seller.responseRate}% response rate</p>
          </div>
          <div className="flex flex-wrap gap-3 self-start sm:self-auto">
            <a href="#seller-products" className="inline-flex min-h-11 items-center justify-center bg-white px-5 t-body t-w-700 text-[#0b6e78] hover:bg-[#eaf9fa]">Shop all products</a>
            <FollowButton sellerId={seller.id} sellerName={seller.name} />
          </div>
        </div>
      </section>

      {topDeals.length > 0 && (
        <section className="gs my-6 overflow-hidden border border-[#e5e7eb] bg-white" aria-labelledby="seller-top-deals">
          <div className="flex items-center justify-between gap-4 bg-[#087f8c] px-4 py-3 text-white">
            <h2 id="seller-top-deals" className="t-title-section t-w-700">Top deals</h2>
            <span className="t-caption">{topDeals.length} picks from {seller.name}</span>
          </div>
          <HoverRail>
            {topDeals.map((product) => (
              <li key={product.id} className="w-[200px] flex-none snap-start border-r border-[#e5e7eb] bg-white sm:w-[220px] lg:w-[calc((100%-90px)/6)]">
                <Card p={product} flash={product.flashSale} />
              </li>
            ))}
          </HoverRail>
        </section>
      )}

      <div id="seller-products" className="mb-5 mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#6b7280]">Seller storefront</p>
          <h2 className="mt-1 t-title-section t-w-700 text-[#111827]">All products from {seller.name}</h2>
        </div>
        <Link href="/sellers" className="t-body t-w-700 text-[#087f8c]">All sellers</Link>
      </div>

      <ProductFeed products={products} />
    </div>
    <Discovery excludeIds={products.map((item) => item.id)} sections={["viewed", "trending"]} />
    </>
  );
}
