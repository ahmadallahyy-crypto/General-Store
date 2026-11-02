"use client"; // Client component: needed for useCart's state and the onClick handlers below

import Image from "@/components/ui/safe-image";
import Link from "next/link"; // Page navigation without a full reload
import { useCart } from "@/components/cart/cart-context"; // Shared cart state (used everywhere: navbar, cart, checkout)
import { Discovery } from "@/components/discovery/discovery";
import { cartLineId } from "@/components/cart/cart-context";
import { variantLabel } from "@/data/product-variants";
import { FREE_DELIVERY_THRESHOLD, HOME_DELIVERY_FEE, amountToFreeDelivery, formatMoney } from "@/lib/store-policies";
import { getMarketplaceProduct, getSeller } from "@/lib/mock/marketplace"; // Look up a product's details and its seller

export default function CartPage() {
  // Pull everything the page needs out of the cart context:
  // cart          -> array of items currently in the cart
  // cartTotal     -> total price of everything in the cart
  // isHydrated    -> whether the cart has finished loading (see below)
  // removeFromCart, updateQuantity -> functions to change the cart
  const { cart, cartCount, cartTotal, isHydrated, removeFromCart, updateQuantity } = useCart();
  const remainingForFree = amountToFreeDelivery(cartTotal);

  // ---------- Loading state ----------
  // Carts are usually stored in localStorage, which only exists in the browser.
  // On the very first render the server doesn't know what's in it, so isHydrated
  // starts false. This avoids showing "empty cart" for a split second before the
  // real cart data loads.
  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center t-body text-[#6b7280]">
        Loading your cart...
      </div>
    );
  }

  // ---------- Empty cart state ----------
  // Runs only after hydration, when we know for certain the cart has 0 items.
  if (!cart.length) {
    return (
      <>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#d1e8e9] bg-[#eff9f9] text-[#087f8c]">
          <svg aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.4L20 8H6M10 20h.01M17 20h.01" />
          </svg>
        </div>
        <h1 className="t-hero t-w-700 tracking-[-0.04em] text-[#111827]">Your cart is empty</h1>
        <p className="mx-auto mt-3 max-w-md t-body leading-relaxed text-[#4b5563]">Find something useful for the next delivery. Your cart will be here when you are ready.</p>
        {/* Sends the user to browse products */}
        <Link
          href="/search"
          className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#087f8c] px-6 t-body t-w-700 text-white transition hover:bg-[#0b6e78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f8c]"
        >
          Explore products
        </Link>
      </div>
      <Discovery />
      </>
    );
  }

  // ---------- Main cart view (only reached when there is at least 1 item) ----------
  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e7eb] pb-5">
        <div>
          <h1 className="t-hero t-w-700 tracking-[-0.04em] text-[#111827]">Your cart</h1>
          <p className="mt-1 t-body text-[#4b5563]">{cartCount} {cartCount === 1 ? "item" : "items"} ready for checkout</p>
        </div>
        <Link href="/search" className="inline-flex min-h-11 items-center text-[#087f8c] underline decoration-[#9acfd2] underline-offset-4 t-body t-w-700 hover:text-[#0b6e78]">
          Continue shopping
        </Link>
      </header>

      <ul className="grid gap-x-6 gap-y-2 border-b border-[#e5e7eb] py-4 text-[#374151] sm:grid-cols-3 t-caption" aria-label="Shopping information">
        <li><span className="t-w-700 text-[#087f8c]">Pickup:</span> always free</li>
        <li><span className="t-w-700 text-[#087f8c]">Home delivery:</span> free over {formatMoney(FREE_DELIVERY_THRESHOLD)}</li>
        <li><span className="t-w-700 text-[#087f8c]">Payment:</span> choose at checkout</li>
      </ul>

      {/* Two columns on large screens: items on the left, summary box on the right */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        {/* ---------- Left: list of cart items ---------- */}
        <section className="space-y-3" aria-label="Items in your cart">
          <h2 className="mb-4 t-title-section t-w-700 text-[#111827]">Items ({cartCount})</h2>
          {/* One card per item in the cart */}
          {cart.map((item) => (
            <article
              key={cartLineId(item)} // one line per product + size + colour
              className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 border border-[#e5e7eb] bg-white p-3 transition-colors hover:border-[#b7d9db] sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5 sm:p-4"
            >
              {/* Product image */}
              <Link href={`/product/${item.handle}`} className="flex aspect-square items-center justify-center bg-[#f8fafb] p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f8c]">
                <Image src={item.image} alt={item.title} width={112} height={112} sizes="(max-width: 640px) 88px, 112px" className="h-full w-full object-contain" />
              </Link>

              <div className="flex min-w-0 flex-col">
                {/* Product title */}
                <Link href={`/product/${item.handle}`} className="w-fit max-w-full t-body t-w-700 leading-snug text-[#111827] underline decoration-transparent underline-offset-2 transition hover:text-[#087f8c] hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f8c]">
                  {item.title}
                </Link>
                {item.variant && <p className="mt-1 t-caption text-[#374151]">{variantLabel(item.variant)}</p>}

                {/* Seller name.
                    getMarketplaceProduct(item.id) looks up the full product to find its sellerId.
                    If that product isn't found, a fallback sellerId is generated from the item's id
                    so a seller can still usually be shown. ?? "Marketplace seller" is the final fallback. */}
                <p className="mt-1 t-caption text-[#6b7280]">
                  {getSeller(
                    getMarketplaceProduct(item.id)?.sellerId ?? `seller-${(Number(item.id) % 15) + 1}`
                  )?.name ?? "Marketplace seller"}
                </p>

                {/* Quantity controls, price, and remove button */}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                  {/* Quantity stepper: minus button, number, plus button */}
                  <div className="inline-flex w-fit items-center border border-[#d1d5db]" role="group" aria-label={`Quantity for ${item.title}`}>
                    {/* Decrease quantity by 1 */}
                    <button
                      type="button"
                      onClick={() => updateQuantity(cartLineId(item), item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.title}`}
                      className="h-10 w-10 text-[#374151] transition hover:bg-[#eff9f9] hover:text-[#087f8c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#087f8c]"
                    >
                      -
                    </button>
                    {/* Current quantity */}
                    <output aria-live="polite" className="w-9 text-center t-body t-w-700 tabular-nums text-[#111827]">{item.quantity}</output>
                    {/* Increase quantity by 1 */}
                    <button
                      type="button"
                      onClick={() => updateQuantity(cartLineId(item), item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.title}`}
                      className="h-10 w-10 text-[#374151] transition hover:bg-[#eff9f9] hover:text-[#087f8c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#087f8c]"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total: price x quantity, 2 decimal places */}
                  <div className="ml-auto text-right">
                    <span className="block t-body t-w-700 tabular-nums text-[#111827]">{formatMoney(item.price * item.quantity)}</span>
                    <span className="t-caption text-[#6b7280]">{formatMoney(item.price)} each</span>
                  </div>

                  {/* Removes this item from the cart entirely */}
                  <button type="button" onClick={() => removeFromCart(cartLineId(item))} aria-label={`Remove ${item.title} from cart`} className="min-h-10 px-2 t-caption t-w-700 text-[#b42318] underline decoration-[#e6a09b] underline-offset-4 hover:text-[#8f1d14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f8c]">
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ---------- Right: order summary box ---------- */}
        {/* sticky + top-28 keeps it visible while the left column scrolls, on large screens */}
        <aside className="h-fit border border-[#d7e2e3] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)] lg:sticky lg:top-28">
          <h2 className="t-title-section t-w-700 text-[#111827]">Order summary</h2>

          <div className="mt-5 space-y-3 t-body text-[#6b7280]">
            {/* Subtotal = same as cartTotal here, since delivery isn't added in yet */}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums text-[#111827]">{formatMoney(cartTotal)}</span>
            </div>
            {/* Home delivery is free over the threshold; pickup stations are always free (chosen at checkout) */}
            <div className="flex justify-between">
              <span>Home delivery</span>
              <span className={`tabular-nums ${remainingForFree === 0 ? "t-w-700 text-[#166534]" : "text-[#111827]"}`}>{remainingForFree === 0 ? "FREE" : `from ${formatMoney(HOME_DELIVERY_FEE)}`}</span>
            </div>
          </div>

          {/* Free-delivery progress */}
          <div className="mt-4" aria-live="polite">
            <p className="t-caption text-[#374151]">
              {remainingForFree > 0 ? `Add ${formatMoney(remainingForFree)} more for free home delivery` : "You have unlocked free home delivery"}
            </p>
            <div className="mt-2 h-2 bg-[#e5e7eb]" role="progressbar" aria-label="Progress toward free home delivery" aria-valuemin={0} aria-valuemax={FREE_DELIVERY_THRESHOLD} aria-valuenow={Math.min(cartTotal, FREE_DELIVERY_THRESHOLD)}>
              <div className="h-2 bg-[#087f8c] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }} />
            </div>
          </div>

          {/* Delivery is confirmed at checkout, so this is not yet the final total. */}
          <div className="mt-5 flex justify-between border-t border-[#e5e7eb] pt-4 t-w-700 text-[#111827]">
            <span>Items subtotal</span>
            <span className="tabular-nums">{formatMoney(cartTotal)}</span>
          </div>
          <p className="mt-2 t-caption text-[#6b7280]">Delivery fee and final total are confirmed at checkout.</p>

          {/* Sends the user to the checkout page */}
          <Link
            href="/checkout"
            className="mt-6 flex min-h-12 items-center justify-center bg-[#087f8c] t-body t-w-700 text-white transition hover:bg-[#0b6e78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f8c]"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
    <Discovery excludeIds={cart.map((item) => item.id)} />
    </>
  );
}
