"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[700px] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#dc2626]">Something went wrong</p>
      <h1 className="mt-2 t-hero t-w-700 tracking-[-0.04em] text-[#111827]">This page hit a problem</h1>
      <p className="mt-3 max-w-md t-body text-[#6b7280]">Please try again. If it keeps happening, head back to the home page.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="min-h-12 bg-[#087f8c] px-6 t-body t-w-700 text-white hover:bg-[#0b6e78]">Try again</button>
        <Link href="/" className="inline-flex min-h-12 items-center border border-[#e5e7eb] bg-white px-6 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">Back to home</Link>
      </div>
    </div>
  );
}
