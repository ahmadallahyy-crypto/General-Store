import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/grid/product-card";

export function ProductShelf({ title, eyebrow, products, href = "/search" }: { title: string; eyebrow: string; products: Product[]; href?: string }) {
  return <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#6b7280]">{eyebrow}</p><h2 className="mt-1 t-title-block t-w-700 tracking-[-0.04em] text-[#111827] sm:t-hero">{title}</h2></div><Link href={href} className="t-body t-w-700 text-[#087f8c]">See all</Link></div><div className="hide-scrollbar overflow-x-auto"><ul className="image-card-rail flex snap-x pb-1">{products.map((product) => <li key={product.id} className="w-[220px] flex-none snap-start sm:w-[240px] lg:w-[250px]"><ProductCard product={product} showDetails /></li>)}</ul></div></section>;
}
