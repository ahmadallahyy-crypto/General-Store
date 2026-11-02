import Image from "@/components/ui/safe-image";
import Link from "next/link";
import type { Seller } from "@/lib/types";

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <article className="group rounded-none border border-[#e5e7eb] bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-[#087f8c]">
      <div className="flex items-center gap-3">
        <Image
          src={seller.avatar}
          alt=""
          width={56}
          height={56}
          sizes="56px"
          className="h-14 w-14 rounded-none object-cover"
        />
        <div className="min-w-0">
          <h2 className="truncate t-w-700 text-[#111827]">{seller.name}</h2>
          <p className="t-caption text-[#6b7280]">
            {seller.category}{seller.verified ? " · Verified" : ""}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between t-body">
        <span className="t-w-500 text-[#111827]">★ {seller.rating.toFixed(1)}</span>
        <span className="text-[#6b7280]">{seller.followers.toLocaleString()} followers</span>
      </div>
      <div className="mt-2 flex items-center justify-between t-caption text-[#6b7280]">
        <span>{seller.responseRate}% response rate</span>
        <span>{seller.totalProducts} products</span>
      </div>
      <Link
        href={`/seller/${seller.id}`}
        className="mt-4 flex min-h-12 items-center justify-center rounded-none bg-[#087f8c] px-4 t-body t-w-700 text-white transition hover:bg-[#0b6e78]"
      >
        Visit shop
      </Link>
    </article>
  );
}
