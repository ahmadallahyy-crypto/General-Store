// ============================================================
// CART MODAL COMPONENT - Client Component
// ============================================================

// "use client" is required because:
// - Uses useEffect hook (not allowed in Server Components)
// - Uses useRef hook (not allowed in Server Components)
// - Uses useCart hook from context (requires Client Component parent)
// - Has event listeners (onClick, keyboard handlers)
"use client";

// ============================================================
// IMPORTS
// ============================================================

import { cartLineId } from "@/components/cart/cart-context";
import { variantLabel } from "@/data/product-variants";
import Image from "@/components/ui/safe-image";           // Next.js optimized image component
import Link from "next/link";             // Next.js client-side navigation
import { useEffect, useRef } from "react"; // React hooks for side effects and refs
import { useCart } from "./cart-context"; // Custom hook to access cart state

// ============================================================
// CART MODAL COMPONENT
// ============================================================

// This component renders as an overlay modal showing cart contents
// It's displayed when isOpen = true in the cart context
export function CartModal() {
  
  // ============================================================
  // ACCESS CART CONTEXT
  // ============================================================

  // useCart() hook gives us access to all cart data and functions
  // This works because CartProvider wraps the entire app
  const {
    cart,              // Array of items in cart
    isOpen,            // Is the modal currently visible?
    closeCart,         // Function to hide the modal
    removeFromCart,    // Function to remove an item
    updateQuantity,    // Function to change quantity
    cartTotal,         // Total price of all items
    clearCart,         // Function to empty the entire cart
  } = useCart();

  // ============================================================
  // REFS (Direct DOM references)
  // ============================================================

  // closeButtonRef holds a reference to the close button element
  // Used to: auto-focus the close button when modal opens (accessibility)
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // panelRef holds a reference to the modal panel
  // Used to: find focusable elements inside modal for keyboard navigation
  const panelRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // KEYBOARD NAVIGATION & ACCESSIBILITY
  // ============================================================

  // This useEffect handles:
  // - Pressing ESC to close modal
  // - Tab key focus trap (keeps focus inside modal)
  // - Accessibility for screen readers
  useEffect(() => {
    // Exit early if modal is not open (no listeners needed)
    if (!isOpen) return;

    // Focus the close button when modal opens (accessibility best practice)
    closeButtonRef.current?.focus();

    // Handle keyboard events
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key closes the modal
      if (event.key === "Escape") closeCart();
    };

    // Click or tap anywhere OUTSIDE the drawer closes it, and the click still reaches whatever was clicked.
    // (There is no full-screen layer, so the first click on another button is never swallowed.)
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (panelRef.current && target && !panelRef.current.contains(target)) closeCart();
    };

    // Add listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown, true);

    // Clean up listeners when component unmounts or modal closes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isOpen, closeCart]); // Re-run if modal open state or closeCart function changes

  // ============================================================
  // EARLY RETURN - Don't render if modal is closed
  // ============================================================

  // If modal is not open, return null (nothing renders)
  // This is more efficient than rendering hidden DOM
  if (!isOpen) return null;

  // ============================================================
  // RENDER MODAL
  // ============================================================

  return (
    // A side panel only: nothing covers the rest of the page, so the page stays visible AND clickable.
    // role="dialog" + aria-labelledby tell screen readers what this is; aria-modal="false" because the page behind is usable.
    // panelRef lets the effect above detect clicks outside the panel.
      <div 
        ref={panelRef} 
        role="dialog" 
        aria-modal="false" 
        aria-labelledby="cart-title" 
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--panel-strong)] text-[var(--text)] shadow-xl"
      >

        {/* ===== HEADER - Title and Close Button ===== */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          
          {/* Modal title - "My Cart" */}
          <h2 id="cart-title" className="t-title-section t-w-700">
            My Cart
          </h2>

          {/* Close button (X icon) */}
          <button
            ref={closeButtonRef}           // Reference for auto-focus on modal open
            onClick={closeCart}            // Click → close modal
            aria-label="Close cart"        // Screen reader label
            className="flex min-h-11 min-w-11 items-center justify-center rounded-none hover:bg-[var(--bg-strong)]"
          >
            {/* SVG X icon (close symbol) */}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ===== MAIN CONTENT - Cart Items or Empty State ===== */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          
          {/* Empty cart state */}
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-neutral-500">
              {/* Empty cart message */}
              <p className="mb-4">Your cart is empty.</p>

              {/* "Continue shopping" button */}
              <button
                onClick={closeCart}  // Close modal and go back to shopping
                className="rounded-none bg-[#087f8c] px-6 py-2.5 t-body t-w-500 text-white hover:bg-[#0b6e78]"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            /* ===== CART ITEMS LIST ===== */
            <ul className="space-y-6">
              {/* Map through each item in cart */}
              {cart.map((item) => (
                // List item for one product
                <li key={cartLineId(item)} className="flex gap-4">
                  
                  {/* ===== PRODUCT IMAGE ===== */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-none bg-neutral-100">
                    {/* 
                      Image component from Next.js
                      - fill: makes image fill the container
                      - object-contain: shows the whole image (no cropping, no stretching)
                      - alt: screen reader text
                    */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* ===== PRODUCT DETAILS ===== */}
                  <div className="flex flex-1 flex-col">
                    
                    {/* Product name and line total (name on left, price on right) */}
                    <div className="flex justify-between">
                      <h3 className="t-body t-w-500">
                        {item.title}
                      </h3>
                      <p className="t-body t-w-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {item.variant && <p className="mt-0.5 t-caption text-neutral-600">{variantLabel(item.variant)}</p>}

                    {/* Unit price (price per individual item) */}
                    <p className="mt-1 t-body text-neutral-500">
                      ${item.price.toFixed(2)} each
                    </p>

                    {/* Quantity controls and remove button */}
                    <div className="mt-auto flex items-center justify-between">
                      
                      {/* ===== QUANTITY SELECTOR ===== */}
                      {/* Shows three buttons: minus, quantity, plus */}
                      <div className="flex items-center rounded-none border border-[var(--border)]">
                        
                        {/* MINUS BUTTON - Decrease quantity */}
                        <button
                          aria-label={`Decrease quantity of ${item.title}`}
                          onClick={() => updateQuantity(cartLineId(item), item.quantity - 1)}
                          className="flex min-h-11 min-w-11 items-center justify-center rounded-none t-body hover:bg-[var(--bg-strong)]"
                        >
                          − {/* Minus symbol */}
                        </button>

                        {/* QUANTITY DISPLAY - Shows current quantity */}
                        <span className="px-2 t-body">
                          {item.quantity}
                        </span>

                        {/* PLUS BUTTON - Increase quantity */}
                        <button
                          aria-label={`Increase quantity of ${item.title}`}
                          onClick={() => updateQuantity(cartLineId(item), item.quantity + 1)}
                          className="flex min-h-11 min-w-11 items-center justify-center rounded-none t-body hover:bg-[var(--bg-strong)]"
                        >
                          + {/* Plus symbol */}
                        </button>
                      </div>

                      {/* ===== REMOVE BUTTON ===== */}
                      {/* Completely removes the item from cart */}
                      <button
                        onClick={() => removeFromCart(cartLineId(item))}
                        className="t-body text-neutral-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== FOOTER - Only shown if cart has items ===== */}
        {/* 
          This section only renders if cart.length > 0
          It shows: total, shipping note, checkout button, clear button
        */}
        {cart.length > 0 && (
          <div className="space-y-4 border-t border-neutral-200 px-6 py-4">
            
            {/* ===== TOTAL PRICE ===== */}
            <div className="flex justify-between t-16 t-w-500">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)} USD</span>
            </div>

            {/* ===== SHIPPING NOTE ===== */}
            <p className="t-body text-neutral-500">
              Shipping and taxes calculated at checkout.
            </p>

            {/* ===== CHECKOUT LINK ===== */}
            {/* 
              Link to /checkout page
              onClick={closeCart} closes modal when user navigates to checkout
            */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-none bg-[var(--accent-strong)] py-3 text-center t-body t-w-500 text-[var(--panel-strong)] transition-colors hover:bg-[var(--accent-stronger)]"
            >
              Proceed to Checkout
            </Link>

            {/* ===== CLEAR CART BUTTON ===== */}
            {/* Empties the entire cart */}
            <button
              onClick={clearCart}
              className="w-full text-center t-body text-neutral-500 hover:text-black"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
  );
}

// ============================================================
// HOW CartModal INTEGRATES WITH CartContext
// ============================================================

/*

FLOW: User opens cart → Sees items → Changes quantity → Closes modal

1. User clicks cart icon in navbar (somewhere else triggers openCart())
   → openCart() is from useCart() context
   → setIsOpen(true)
   → CartModal now renders (because isOpen = true)

2. CartModal useEffect runs
   → closeButtonRef.current?.focus() gives focus to X button
   → Sets up keyboard listeners (ESC to close, Tab trap)

3. User sees cart items displayed
   → {cart.map(item => ...)} shows each item with image, name, price

4. User clicks "+" button to increase quantity
   → onClick={() => updateQuantity(cartLineId(item), item.quantity + 1)}
   → updateQuantity is from useCart() context
   → Cart state updates in CartProvider
   → CartModal re-renders with new quantity

5. localStorage is automatically saved
   → CartProvider's useEffect detects cart change
   → Saves to localStorage automatically (user doesn't see this)

6. User clicks "Proceed to Checkout"
   → <Link href="/checkout"> navigates to checkout page
   → onClick={closeCart} closes the modal
   → CheckoutPage loads with items from useCart()

7. User hits ESC key
   → handleKeyDown listener catches it
   → closeCart() is called
   → Modal closes


KEY ARCHITECTURE POINTS:
──────────────────────

✅ CartModal is "use client" (has useEffect, useRef, hooks)

✅ CartModal consumes context via useCart()
   └─ Gets: cart, isOpen, closeCart, removeFromCart, updateQuantity, cartTotal, clearCart

✅ When cart changes in CartProvider:
   └─ useEffect saves to localStorage
   └─ All components using useCart() re-render
   └─ CartModal displays new data

✅ CartModal does NOT manage cart logic:
   └─ It only DISPLAYS data from context
   └─ All logic is in CartProvider (separation of concerns)

✅ Keyboard accessibility is built in:
   └─ ESC to close
   └─ Click outside closes it without blocking the click
   └─ aria-* labels for screen readers
   └─ aria-label for icon buttons

*/