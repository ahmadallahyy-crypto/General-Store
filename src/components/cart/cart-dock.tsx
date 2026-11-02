"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";

const CartPanel = dynamic(
  () => import("@/components/cart/cart-panel").then((module) => module.CartPanel),
  { ssr: false, loading: () => null },
);

/**
 * The home page's cart panel (Subtotal, free-delivery note, Checkout, Go to cart, your items),
 * docked on the RIGHT of browse pages on screens 1280px and wider. A compact tab keeps the cart
 * reachable at smaller sizes.
 * The home page already has this same panel in its own layout, and /cart and /checkout
 * show the full cart, so the dock is hidden on those three.
 */
export function CartDock() {
  const pathname = usePathname();
  const { cartCount, isHydrated } = useCart();
  if (pathname === "/" || pathname === "/cart" || pathname === "/checkout") return null;
  const count = isHydrated ? cartCount : 0;
  const hasItems = count > 0;

  return (
    <>
      <div className="gs cart-dock hidden w-[250px] shrink-0 xl:block">
        <CartPanel />
      </div>
      <Link href="/cart" aria-label={`Open cart, ${count} items`} className={`fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 bg-[#087f8c] px-2 py-3 text-white shadow-lg ${hasItems ? "xl:hidden" : ""}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" /></svg>
        <span className="t-caption t-w-700">{count}</span>
      </Link>
    </>
  );
}
