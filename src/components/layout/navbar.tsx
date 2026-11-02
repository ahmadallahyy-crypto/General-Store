"use client";

import { NavAccountLink, NavBellLink } from "@/components/auth/nav-account";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CategoryMenu } from "@/components/layout/category-menu";
import { SearchBox } from "@/components/search/search-box";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { CartModal } from "@/components/cart/cart-modal";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { usePathname } from "next/navigation";
import { categoryGroups, getCategoryRoute, getSubcategoryRoute } from "@/data/products";

const categories = [
  { title: "Local store", path: "/shops", icon: "M3 10h18M5 10V6h14v4M5 10v10h14V10M9 20v-6h6v6" },
  { title: "Automobile", path: getCategoryRoute("automobile"), icon: "M5 17h14m-1 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M5 17H4V9l2-4h12l2 4v8h-1M5 17a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M4 9h16M7 13h.01M17 13h.01" },
  ...categoryGroups
    .filter((item) => item.slug !== "automobile")
    .map((item) => ({ title: item.title, path: getCategoryRoute(item.slug), icon: item.icon })),
];

export function Navbar() {
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const categoryStripRef = useRef<HTMLDivElement>(null);
  const hoveredGroup = categoryGroups.find((category) => category.title === hoveredCategory) ?? null;

  useEffect(() => {
    let scrollEndTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsScrolling(false);
        return;
      }

      setIsScrolling(true);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => setIsScrolling(false), 320);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-[#e5e5e5] bg-white">
        <div className="nav-shell mx-auto max-w-[1800px] px-4 sm:px-8">
          <div className="nav-row grid min-h-[90px] grid-cols-[1fr_auto] items-center gap-4 xl:grid-cols-[auto_minmax(20rem,1fr)_auto] xl:gap-8">
            <div className="nav-brand-actions flex items-center gap-1 sm:gap-2">
              {/* Logo first, so it stays on the page's left edge on every screen. On phones the menu button is
                  moved in front of it (order-first); on computers it sits just after it. */}
              <Link href="/" aria-label="General-Store home" className="flex w-fit items-center py-2">
              <BrandLogo />
            </Link>
              <div className="order-first xl:order-none xl:ml-3">
                <CategoryMenu />
              </div>
            </div>

            <SearchBox variant="desktop" />

            <div className="nav-actions flex items-center justify-self-end gap-1 sm:gap-2">
              <NavAccountLink />
              <Link href="/wishlist" aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`} title="Wishlist" className="nav-narrow-action relative flex h-12 items-center gap-2 px-2 text-[14px] font-medium leading-tight tracking-[0.01em] text-[#404040] transition hover:bg-[#eaf9fa] sm:px-3">
                <svg aria-hidden="true" className="h-[18px] w-[18px] flex-none" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                </svg>
                <span className="hidden lg:inline">Wishlist</span>
                {wishlistCount > 0 && <span aria-hidden="true" className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-[#ff4d4f] px-1 t-badge t-w-500 text-white">{wishlistCount}</span>}
              </Link>
              <Link href="/orders" aria-label="Orders" title="Orders" className="nav-narrow-action flex h-12 items-center gap-2 px-2 text-[14px] font-medium leading-tight tracking-[0.01em] text-[#404040] transition hover:bg-[#eaf9fa] sm:px-3">
                <svg aria-hidden="true" className="h-[18px] w-[18px] flex-none" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 4.5h14v17l-7-4-7 4v-17ZM8 8h8M8 11.5h8" />
                </svg>
                <span className="hidden lg:inline">Orders</span>
              </Link>
              <NavBellLink />
              <button type="button" onClick={openCart} aria-label="Open cart" className="nav-narrow-action relative flex h-12 w-12 items-center justify-center text-black transition hover:bg-[#eaf9fa]">
                <svg aria-hidden="true" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1-1.5 0z" />
                </svg>
                {cartCount > 0 && <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-[#ff4d4f] px-1 t-badge t-w-500 text-white">{cartCount}</span>}
              </button>
            </div>
          </div>

          <SearchBox variant="mobile" />

          {/* Category strip + mega menu: home page only. Every other page keeps just the logo, search and account row. */}
          {pathname === "/" && (
          <div
            aria-hidden={isScrolling}
            inert={isScrolling}
            className={`nav-strip group relative border-t border-[#e5e5e5] transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none ${isScrolling ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div ref={categoryStripRef} className="nav-strip-in hide-scrollbar overflow-x-auto">
              <ul className="flex min-w-max items-center gap-1 py-2.5 t-16 t-w-400">
                {categories.map((item) => {
                  const isActive = hoveredCategory === item.title || pathname === item.path || pathname.startsWith(`${item.path}/`);
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.path}
                        onMouseEnter={() => setHoveredCategory(item.title)}
                        className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 transition ${isActive ? "bg-[#fff1eb] text-[#ff6a3d]" : "text-[#404040] hover:bg-[#eaf9fa] hover:text-[#0b6e78]"}`}
                      >
                        <svg aria-hidden="true" className="h-5 w-5 flex-none stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24">
                          <path d={item.icon} />
                        </svg>
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => {
                const strip = categoryStripRef.current;
                if (strip) strip.scrollBy({ left: strip.clientWidth * 0.85, behavior: "smooth" });
              }}
              className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#111827] opacity-0 shadow-md transition-opacity duration-200 hover:bg-[#087f8c] hover:text-white focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>

            {hoveredGroup && hoveredGroup.subCategories.length > 0 && (
              <div className="absolute inset-x-4 top-full z-40 border border-[#f0e6dd] bg-white p-6 shadow-[0_20px_45px_rgba(33,25,22,0.12)] sm:inset-x-8">
                {hoveredGroup.subGroups?.length ? (
                  <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {hoveredGroup.subGroups.map((subGroup) => (
                      <div key={subGroup.title}>
                        <p className="mb-2 t-body-strong text-[#241d1b]">{subGroup.title}</p>
                        <ul className="divide-y divide-[#f3ece6]">
                          {subGroup.links.map((entry, linkIndex) => (
                            <li key={`${entry.slug}-${linkIndex}`}>
                              <Link href={getSubcategoryRoute(hoveredGroup.slug, entry.slug)} className="block py-2 t-14 text-[#514743] transition hover:text-[#ff6a3d]">{entry.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                      <p className="mb-3 t-body-strong text-[#241d1b]">Browse {hoveredGroup.title}</p>
                      <ul className="space-y-2.5">
                        {hoveredGroup.subCategories.map((entry) => (
                          <li key={entry.slug}>
                            <Link href={getSubcategoryRoute(hoveredGroup.slug, entry.slug)} className="block t-14 text-[#514743] transition hover:text-[#ff6a3d]">{entry.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>
      </nav>
      <CartModal />
    </>
  );
}
