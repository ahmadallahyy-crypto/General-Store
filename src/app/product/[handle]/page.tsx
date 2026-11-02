import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Discovery } from "@/components/discovery/discovery";
import { getProduct, products } from "@/data/products";
import { ProductDetail } from "@/components/product/product-detail";
import { getMarketplaceProduct } from "@/lib/mock/marketplace";

export function generateStaticParams() {
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return { title: "Product not found" };
  const description = product.description.length > 155 ? `${product.description.slice(0, 152)}...` : product.description;
  return {
    title: product.title,
    description,
    openGraph: { title: product.title, description, images: product.image ? [product.image] : [] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 10);

  // Product data for search engines (shown in Google results as price, stars and availability).
  const market = getMarketplaceProduct(product.id);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: `GS-${product.id.padStart(4, "0")}`,
    ...(market?.brand ? { brand: { "@type": "Brand", name: market.brand } } : {}),
    offers: { "@type": "Offer", price: product.price.toFixed(2), priceCurrency: product.currency ?? "USD", availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" },
    ...(market ? { aggregateRating: { "@type": "AggregateRating", ratingValue: market.rating, reviewCount: market.reviewCount } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <ProductDetail product={product} related={related} allProducts={products} />
      <Discovery excludeIds={[product.id]} sections={["searched", "trending"]} />
    </>
  );
}
