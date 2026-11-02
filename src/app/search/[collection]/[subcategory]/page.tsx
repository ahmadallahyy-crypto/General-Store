import { CategoryLanding } from "@/components/category/category-landing";
import { Discovery } from "@/components/discovery/discovery";
import { ProductGrid } from "@/components/grid/product-grid";
import {
  categoryGroups,
  getCategoryLabel,
  getSubcategoryLabel,
} from "@/data/products";
import { subcategoryImage } from "@/data/tile-images";
import { marketplaceProducts, searchCatalog } from "@/lib/mock/marketplace";

export function generateStaticParams() {
  return categoryGroups.flatMap((group) =>
    group.subCategories.map((sub) => ({
      collection: group.slug,
      subcategory: sub.slug,
    }))
  );
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; subcategory: string }>;
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { collection, subcategory } = await params;
  const { q, sort } = await searchParams;

  const categoryLabel = getCategoryLabel(collection);
  const subcategoryLabel = getSubcategoryLabel(collection, subcategory);

  if (collection !== "official-store") {
    const exactProducts = searchCatalog({ category: collection, subcategory, query: q, sort });
    // Some catalog categories do not have dedicated subcategory inventory yet.
    // Keep those routes useful by showing the parent category assortment.
    const products = exactProducts.length || q
      ? exactProducts
      : searchCatalog({ category: collection, query: undefined, sort });

    return (
      <CategoryLanding
        collection={collection}
        products={products}
        sort={sort}
        title={subcategoryLabel}
        description={`${subcategoryLabel} in ${categoryLabel}. Browse the latest picks and deals.`}
        heroImage={subcategoryImage(subcategory)}
      />
    );
  }

  const officialStore = marketplaceProducts.filter((product) => product.isOfficialStore);
  const newArrivalIds = new Set(
    [...officialStore].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 6).map((product) => product.id)
  );
  const bestSellerIds = new Set(
    [...officialStore].sort((a, b) => b.rating - a.rating).slice(0, 6).map((product) => product.id)
  );
  const filtered = collection === "official-store"
    ? officialStore.filter((product) => {
        if (subcategory === "featured-picks") return product.featured;
        if (subcategory === "top-deals") return product.flashSale;
        if (subcategory === "new-arrivals") return newArrivalIds.has(product.id);
        if (subcategory === "best-sellers") return bestSellerIds.has(product.id);
        if (subcategory === "clearance") return product.flashSale && product.originalPrice !== undefined;
        return true; // trending-brands: every official-store brand
      })
    : searchCatalog({ category: collection, subcategory, query: q, sort });

  return (
    <>
      <ProductGrid
        products={filtered}
        title={subcategoryLabel}
        description={`${subcategoryLabel} in ${categoryLabel}.`}
      />
      <Discovery excludeIds={filtered.map((item) => item.id)} />
    </>
  );
}
