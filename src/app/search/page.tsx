import { NearbyShops } from "@/components/shops/nearby-shops";
import { Discovery } from "@/components/discovery/discovery";
import { RecordSearch } from "@/components/marketplace/record-search";
import { SearchResults } from "@/components/marketplace/search-results";
import { catalogDidYouMean, searchCatalog } from "@/lib/mock/marketplace";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;
  const products = searchCatalog({ query: q, sort });
  // Nothing found? Offer a corrected spelling ("did you mean ...").
  const suggestion = q && products.length === 0 ? catalogDidYouMean(q) : null;

  return (
    <>
      {!q && (
        <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
          <NearbyShops limit={3} />
        </div>
      )}
      <RecordSearch query={q} resultCount={products.length} />
      <SearchResults key={q ?? ""} products={products} title={q ? `Search results for “${q}”` : "All products"} query={q} suggestion={suggestion} />
      <Discovery />
    </>
  );
}
