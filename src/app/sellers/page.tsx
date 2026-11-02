"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Discovery } from "@/components/discovery/discovery";
import { SellerCard } from "@/components/marketplace/seller-card";
import { sellers } from "@/lib/mock/marketplace";

export default function SellersPage() {
  const [category, setCategory] = useState("All");
  const [rating, setRating] = useState("All");
  const categories = ["All", ...Array.from(new Set(sellers.map((seller) => seller.category)))];
  const filtered = useMemo(() => sellers.filter((seller) => (category === "All" || seller.category === category) && (rating === "All" || seller.rating >= Number(rating))), [category, rating]);

  return (
    <>
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-none border border-[#e2f7f9] bg-[#eaf9fa] p-6 sm:p-8">
        <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#087f8c]">Marketplace directory</p>
        <h1 className="mt-2 t-hero t-w-700 tracking-[-0.05em] text-[#111827] sm:t-hero">Find a trusted seller</h1>
        <p className="mt-3 max-w-2xl t-body text-[#4b5563]">Browse independent shops, compare ratings, and discover the people behind your next order. <Link href="/shops" className="t-w-700 text-[#087f8c]">Looking for a shop close to you?</Link></p>
      </header>
      <div className="mb-6 flex flex-wrap gap-3 rounded-none border border-[#e5e7eb] bg-white p-4">
        <label className="flex min-h-12 items-center gap-2 t-body t-w-500 text-[#374151]">Category
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-none border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 t-w-400 outline-none focus:border-[#087f8c]">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-2 t-body t-w-500 text-[#374151]">Rating
          <select value={rating} onChange={(event) => setRating(event.target.value)} className="rounded-none border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 t-w-400 outline-none focus:border-[#087f8c]">
            <option value="All">All ratings</option><option value="4">4★ and up</option><option value="4.5">4.5★ and up</option>
          </select>
        </label>
        <span className="ml-auto self-center t-body text-[#6b7280]">{filtered.length} sellers</span>
      </div>
      <div className="image-grid-gap grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((seller) => <SellerCard key={seller.id} seller={seller} />)}
      </div>
    </div>
    <Discovery />
    </>
  );
}
