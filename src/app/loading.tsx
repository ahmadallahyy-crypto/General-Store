export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="h-40 animate-pulse bg-[#e5e7eb]" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square animate-pulse bg-[#e5e7eb]" />
            <div className="h-4 w-3/4 animate-pulse bg-[#e5e7eb]" />
            <div className="h-4 w-1/2 animate-pulse bg-[#e5e7eb]" />
          </div>
        ))}
      </div>
    </div>
  );
}
