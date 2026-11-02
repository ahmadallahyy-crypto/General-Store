import Link from "next/link";
import { NearbyShops } from "@/components/shops/nearby-shops";

export default function ShopsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 t-caption text-[#6b7280]">
        <Link href="/" className="hover:text-[#087f8c]">Home</Link> <span aria-hidden="true">/</span> <span className="text-[#111827]">Local store</span>
      </nav>
      <NearbyShops headingLevel="h1" title="Local stores near you" subtitle="Find fashion boutiques, pharmacies, supermarkets and more close to where you are." />
      <p className="mt-6 t-body text-[#4b5563]">
        Looking for something specific? <Link href="/search" className="t-w-700 text-[#087f8c]">Browse all products</Link> or{" "}
        <Link href="/sellers" className="t-w-700 text-[#087f8c]">see every seller</Link>.
      </p>
    </div>
  );
}
