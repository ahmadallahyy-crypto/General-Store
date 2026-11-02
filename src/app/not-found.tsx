import Link from "next/link";
import { Discovery } from "@/components/discovery/discovery";

export default function NotFound() {
  return (
    <>
    <div className="mx-auto flex min-h-[40vh] max-w-[700px] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#087f8c]">Error 404</p>
      <h1 className="mt-2 t-hero t-w-700 tracking-[-0.04em] text-[#111827]">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md t-body text-[#6b7280]">The product, seller, or order you were looking for may have moved or no longer exists.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center bg-[#087f8c] px-6 t-body t-w-700 text-white hover:bg-[#0b6e78]">Back to home</Link>
        <Link href="/search" className="inline-flex min-h-12 items-center border border-[#e5e7eb] bg-white px-6 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">Browse products</Link>
      </div>
    </div>
    <Discovery sections={["trending"]} />
    </>
  );
}
