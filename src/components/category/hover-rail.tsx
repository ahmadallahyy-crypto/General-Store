"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function HoverRail({ children, listClassName = "" }: { children: React.ReactNode; listClassName?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#111827] opacity-0 shadow-md transition-opacity duration-200 hover:bg-[#087f8c] hover:text-white focus-visible:opacity-100 group-hover/rail:opacity-100 md:flex";

  return (
    <div className="group/rail relative">
      {!edge.start && (
        <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className={`${arrow} left-2`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
      )}
      <ul ref={ref} onScroll={measure} className={`image-card-rail hide-scrollbar flex snap-x overflow-x-auto ${listClassName}`}>
        {children}
      </ul>
      {!edge.end && (
        <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className={`${arrow} right-2`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      )}
    </div>
  );
}
