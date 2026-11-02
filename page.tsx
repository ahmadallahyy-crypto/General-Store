import { ProductGrid } from "@/components/grid/product-grid";
import { categoryGroups, getCategoryLabel, getFilteredProducts } from "@/data/products";
import { marketplaceProducts } from "@/lib/mock/marketplace";

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
  const { q, sort } = await searchParams;

  const filtered =
    collection === "official-store"
      ? marketplaceProducts.filter((product) => product.isOfficialStore)
      : getFilteredProducts({ category: collection, query: q, sort });

  const label = getCategoryLabel(collection);

  return <ProductGrid products={filtered} title={label} description={`Shop ${label}.`} />;
}