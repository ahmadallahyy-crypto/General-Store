import { CategoryLanding } from "@/components/category/category-landing";
import { NearbyShops } from "@/components/shops/nearby-shops";
import { OfficialStores } from "@/components/category/official-stores";
import { categoryGroups } from "@/data/products";
import { searchCatalog } from "@/lib/mock/marketplace";

export function generateStaticParams() {
  return categoryGroups.map((group) => ({ collection: group.slug }));
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { collection } = await params;
  if (collection === "official-store") return <OfficialStores />;
  const { q, sort } = await searchParams;

  const filtered = searchCatalog({ category: collection, query: q, sort });

  const landing = <CategoryLanding collection={collection} products={filtered} sort={sort} />;
  // Supermarket is both a product category AND a shop type, so offer the local supermarkets too.
  if (collection === "supermarket" && !q) {
    return (
      <>
        <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
          <NearbyShops limit={3} lockType="supermarket" title="Supermarkets near you" subtitle="Prefer to pick up or get same-day delivery from a store close by? Choose one here, or keep browsing groceries below." />
        </div>
        {landing}
      </>
    );
  }
  return landing;
}