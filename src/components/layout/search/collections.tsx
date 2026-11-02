"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { categoryGroups } from "@/data/products";

const collections = [
  { title: "All", path: "/search" },
  ...categoryGroups.map((item) => ({ title: item.title, path: `/search/${item.slug}` })),
];

const categoryIcons: Record<string, string> = Object.fromEntries([
  ["All", "M4 4h6v6H4zm10 0h6v6h-6zm-10 10h6v6H4zm10 0h6v6h-6z"],
  ...categoryGroups.map((item) => [item.title, item.icon]),
]);

function CategoryIcon({ title }: { title: string }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 flex-none stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
    >
      <path d={categoryIcons[title]} />
    </svg>
  );
}

export function Collections() {
  const pathname = usePathname();

  return (
    <nav>
      <h3 className="hidden t-caption t-w-500 text-[#665c58] md:block">
        Collections
      </h3>
      <ul className="mt-4 hidden space-y-1 md:block">
        {collections.map((item) => {
          const active = pathname === item.path || (item.path === "/search" && pathname === "/search");
          return (
            <li className="flex t-16 text-[#3c3430]" key={item.title}>
              <Link
                href={item.path}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-none px-2.5 py-2 transition hover:bg-[#eaf9fa] hover:text-[#0b6e78] hover:underline underline-offset-4",
                  active && "bg-[#eaf9fa] t-w-500 text-[#0b6e78]"
                )}
              >
                <CategoryIcon title={item.title} />
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile select */}
      <div className="md:hidden">
        <select
          className="w-full rounded-none border border-[var(--border)] bg-white px-3 py-3 t-body text-black"
          onChange={(e) => {
            window.location.href = e.target.value;
          }}
          defaultValue={pathname}
        >
          {collections.map((item) => (
            <option key={item.title} value={item.path}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
