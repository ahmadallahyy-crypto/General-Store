import Link from "next/link";
import { categoryGroups } from "@/data/products";
import { getTrendingSearches } from "@/lib/mock/marketplace";

const chip = "inline-flex min-h-10 items-center border border-[#e5e7eb] bg-white px-4 t-body capitalize text-[#374151] hover:border-[#087f8c] hover:text-[#087f8c]";

/**
 * Shown when a search finds nothing. Never a dead end: a corrected spelling when we can guess one,
 * tips for searching, and ways to keep browsing.
 */
export function EmptyResults({ query, suggestion }: { query?: string; suggestion?: string | null }) {
  return (
    <div className="rounded-none border border-dashed border-[#cbd5e1] bg-white p-8 sm:p-10">
      <h2 className="t-title-block t-w-700 text-[#111827]">{query ? `No results for “${query}”` : "No products found"}</h2>
      {suggestion && (
        <p className="mt-3 t-body text-[#374151]">
          Did you mean{" "}
          <Link href={`/search?q=${encodeURIComponent(suggestion)}`} className="t-w-700 text-[#087f8c] underline">{suggestion}</Link>?
        </p>
      )}
      <ul className="mt-4 list-disc space-y-1 pl-5 t-body text-[#6b7280]">
        <li>Check the spelling, or try a shorter or more general word.</li>
        <li>Search for the item type, like “hoodie” or “phone”, instead of a full name.</li>
        <li>Every word you type has to match, so try fewer words.</li>
      </ul>

      <h3 className="mt-6 t-title-block t-w-700 text-[#111827]">Popular searches</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {getTrendingSearches(6).map((term) => (
          <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className={chip}>{term}</Link>
        ))}
      </div>

      <h3 className="mt-6 t-title-block t-w-700 text-[#111827]">Browse a category</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {categoryGroups.slice(0, 8).map((group) => (
          <Link key={group.slug} href={`/search/${group.slug}`} className={chip}>{group.title}</Link>
        ))}
        <Link href="/search" className={`${chip} t-w-700 text-[#087f8c]`}>All products</Link>
      </div>
    </div>
  );
}
