import Image from "next/image";
import Link from "next/link";
import { categoryGroups, products } from "@/data/products";

export function CategoryGrid() {
  const categories = categoryGroups.slice(1, 9).map((category, index) => ({ category, product: products.find((item) => category.categories.includes(item.category)) ?? products[index] }));
  return <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8"><div className="mb-5 flex items-end justify-between"><div><p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#6b7280]">Browse the marketplace</p><h2 className="mt-1 t-title-block t-w-700 tracking-[-0.04em] text-[#111827] sm:t-hero">Shop by category</h2></div><Link href="/search" className="t-body t-w-700 text-[#087f8c]">View all</Link></div><div className="image-grid-gap grid grid-cols-2 sm:grid-cols-4">{categories.map(({ category, product }) => <Link key={category.slug} href={`/search/${category.slug}`} className="group relative aspect-[1.35] overflow-hidden rounded-none bg-[#111827]"><Image src={product.image} alt="" fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover opacity-75 transition duration-300 group-hover:scale-105 group-hover:opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" /><span className="absolute bottom-3 left-3 t-body t-w-700 text-white sm:t-16">{category.title}</span></Link>)}</div></section>;
}
