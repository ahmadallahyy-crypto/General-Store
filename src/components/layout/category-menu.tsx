"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { categoryGroups } from "@/data/products";

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * "Categories" button + slide-in menu.
 * - Phones and tablets: a menu button on every page (including home).
 * - Computers: only on inner pages, because the home page has the full category strip instead.
 * The list is built from the same categoryGroups data as the rest of the site.
 */
export function CategoryMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // page behind does not scroll
    closeRef.current?.focus();
    const button = buttonRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      button?.focus(); // give focus back to the button that opened the menu
    };
  }, [open]);

  const link = "block px-5 py-3 t-body text-[#111827] hover:bg-[#f9fafb]";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Open categories menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`nav-narrow-menu flex h-12 w-12 items-center justify-center text-black transition hover:bg-[#eaf9fa] ${pathname === "/" ? "xl:hidden" : ""}`}
      >
        <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Browse categories">
            <button type="button" aria-label="Close menu" tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0" />  {/* invisible click-outside area: no tint, no blur */}
            <div className="absolute left-0 top-0 flex h-full w-[320px] max-w-[88vw] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
                <h2 className="t-16 t-w-700 text-[#111827]">Categories</h2>
                <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center t-title-section text-[#374151] hover:bg-[#f3f4f6]">×</button>
              </div>
              <nav aria-label="Categories" className="flex-1 overflow-y-auto pb-6">
                <Link href="/shops" onClick={() => setOpen(false)} className={`${link} t-w-700`}>Local store</Link>
                <Link href="/sellers" onClick={() => setOpen(false)} className={`${link} t-w-700`}>Sellers</Link>
                <ul className="mt-1 border-t border-[#e5e7eb]">
                  {categoryGroups.map((group) => {
                    const isOpen = expanded === group.slug;
                    return (
                      <li key={group.slug} className="border-b border-[#f3f4f6]">
                        <button type="button" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : group.slug)} className="flex w-full items-center justify-between px-5 py-3 text-left t-body-strong text-[#111827] hover:bg-[#f9fafb]">
                          <span>{group.title}</span>
                          <svg aria-hidden="true" className={`h-4 w-4 text-[#6b7280] transition ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
                        </button>
                        {isOpen && (
                          <ul className="bg-[#f9fafb] pb-2">
                            <li><Link href={`/search/${group.slug}`} onClick={() => setOpen(false)} className="block px-8 py-2 t-14 t-w-700 text-[#087f8c]">See all {group.title}</Link></li>
                            {group.subCategories.map((sub) => (
                              <li key={sub.slug}><Link href={`/search/${group.slug}/${sub.slug}`} onClick={() => setOpen(false)} className="block px-8 py-2 t-14 text-[#374151] hover:text-[#087f8c]">{sub.title}</Link></li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
