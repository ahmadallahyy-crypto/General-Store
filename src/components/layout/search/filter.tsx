"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

const sorting = [
  { title: "Relevance", slug: null },
  { title: "Trending", slug: "trending-desc" },
  { title: "Latest arrivals", slug: "latest-desc" },
  { title: "Price: Low to high", slug: "price-asc" },
  { title: "Price: High to low", slug: "price-desc" },
];

export function FilterList({ title = "Sort by" }: { title?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");

  return (
    <nav>
      <h3 className="hidden t-caption t-w-500 text-[#665c58] md:block">
        {title}
      </h3>
      <ul className="mt-4 hidden space-y-1 md:block">
        {sorting.map((item) => {
          const active = item.slug === currentSort || (!item.slug && !currentSort);
          const nextParams = new URLSearchParams(searchParams.toString());

          if (item.slug) {
            nextParams.set("sort", item.slug);
          } else {
            nextParams.delete("sort");
          }

          const href = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;

          return (
            <li className="flex t-caption text-[#3c3430]" key={item.title}>
              <Link
                href={href}
                className={clsx(
                  "w-full rounded-none px-2 py-1.5 transition hover:bg-[#eaf9fa] hover:text-[#0b6e78] hover:underline underline-offset-4",
                  active && "bg-[#eaf9fa] t-w-500 text-[#0b6e78]"
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
