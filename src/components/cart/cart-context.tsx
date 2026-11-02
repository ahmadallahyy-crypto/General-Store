// ============================================================
// CART CONTEXT PROVIDER - Client Component
// ============================================================

// "use client" directive:
// - Marks this entire file as a CLIENT COMPONENT
// - This is REQUIRED because CartProvider uses React hooks (useState, useEffect, useContext)
// - Server Components in Next.js 13+ cannot use hooks
// - This runs ONLY in the browser, NOT on the server
"use client";

// ============================================================
// IMPORTS
// ============================================================

import Link from "next/link";
import {
  createContext,      // Creates a new React context for sharing state
  useContext,         // Hook to access context values
  useState,           // Hook to manage local component state
  useRef,             // Holds the timer for the "added to cart" message
  useCallback,        // Hook to memoize callback functions (performance optimization)
  ReactNode,          // TypeScript type for React children
} from "react";

// Import the Product type from the products data file
import { Product } from "@/data/products";

// Shared hook that handles localStorage read-on-mount / write-on-change
import { usePersistentState } from "@/lib/use-persistent-state";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

// CartItem extends Product with an additional 'quantity' field
// This type represents items in the shopping cart
// A choice the shopper made before adding (size / colour). `sizeLabel` is only used to word the cart line ("Age: 1–2 years").
export type CartVariant = { size?: string; color?: string; sizeLabel?: string };

// `lineId` identifies ONE line in the cart: the same product in two sizes is two lines.
// Carts saved before variants existed have no lineId, so always read it with cartLineId(item).
export type CartItem = Product & { quantity: number; variant?: CartVariant; lineId?: string };

export const makeLineId = (productId: string, variant?: CartVariant) =>
  variant && (variant.size || variant.color) ? `${productId}::${variant.size ?? ""}::${variant.color ?? ""}` : productId;

export const cartLineId = (item: CartItem) => item.lineId ?? item.id;

// CartContextType defines the shape of all data and functions available through context
// This is what components can access when they use the useCart() hook
type CartContextType = {
  cart: CartItem[];                                    // Array of items in cart
  isHydrated: boolean;                                 // Flag: has client hydration completed?
  addToCart: (product: Product, quantity?: number, variant?: CartVariant) => void;    // Add item or increase quantity
  removeFromCart: (lineId: string) => void;           // Remove one cart line completely
  updateQuantity: (lineId: string, quantity: number) => void;  // Change quantity of one cart line
  clearCart: () => void;                              // Empty the entire cart
  cartCount: number;                                  // Total number of items (sum of quantities)
  cartTotal: number;                                  // Total price of all items
  isOpen: boolean;                                    // Is the cart modal visible?
  openCart: () => void;                               // Show cart modal
  closeCart: () => void;                              // Hide cart modal
};

// ============================================================
// CONTEXT CREATION
// ============================================================

// Creates a React context that will hold cart data
// Initially undefined (will be provided by CartProvider)
// This allows any component to access cart state without prop drilling
const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================
// CART PROVIDER COMPONENT
// ============================================================

// This component wraps your entire app and provides cart context to all children
// It manages all cart state and persists to localStorage
// Parent: typically placed in app/layout.tsx around <body> content
export function CartProvider({ children }: { children: ReactNode }) {

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  // State 1 & 2: The shopping cart array plus its hydration flag
  // usePersistentState loads the saved cart from localStorage on mount and
  // writes it back on every change, returning [cart, setCart, isHydrated].
  // isHydrated stays false until that first read completes, which prevents
  // hydration mismatches between the server-rendered (empty) HTML and the
  // client-rendered (restored) cart.
  const [cart, setCart, isHydrated] = usePersistentState<CartItem[]>("acme-cart", []);

  // State 3: Cart modal visibility
  // Controls whether the slide-over cart panel is shown
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ============================================================
  // CALLBACK FUNCTIONS (Memoized for performance)
  // ============================================================

  // useCallback prevents these functions from being recreated on every render
  // This matters when functions are passed as dependencies or used in useEffect
  const openCart = useCallback(() => setIsOpen(true), []);   // Show cart modal
  const closeCart = useCallback(() => setIsOpen(false), []); // Hide cart modal

  // ============================================================
  // CART ACTIONS
  // ============================================================

  // (localStorage read/write is handled by usePersistentState above)

  // ADD TO CART: Adds a product or increases quantity if already in cart
  const addToCart = (product: Product, quantity = 1, variant?: CartVariant) => {
    const lineId = makeLineId(product.id, variant);
    setCart((prev) => {
      // Is this exact product + size + colour already in the cart?
      const existing = prev.find((item) => cartLineId(item) === lineId);

      // If it is, increase its quantity
      if (existing) {
        return prev.map((item) =>
          cartLineId(item) === lineId
            ? { ...item, quantity: item.quantity + quantity } // Increase quantity
            : item
        );
      }

      // If not, add it as a new cart line
      return [...prev, { ...product, quantity, variant, lineId }];
    });

    // Confirm with a small message. The drawer is NOT opened by itself: it is wide and would sit on top of the
    // page's Buy / Add buttons. Shoppers open it with the cart icon, or with "View cart" in the message below.
    const label = [variant?.sizeLabel && variant.size ? `${variant.sizeLabel}: ${variant.size}` : variant?.size, variant?.color].filter(Boolean).join(" · ");
    setNotice(`${product.title}${label ? ` (${label})` : ""} added to cart`);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3200);
  };

  // REMOVE FROM CART: Completely removes an item from the cart
  const removeFromCart = (lineId: string) => {
    setCart((prev) => prev.filter((item) => cartLineId(item) !== lineId));
  };

  // UPDATE QUANTITY: Changes the quantity of an item
  const updateQuantity = (lineId: string, quantity: number) => {
    // If quantity is 0 or negative, remove the line entirely
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }

    // Otherwise, update the quantity for that line
    setCart((prev) =>
      prev.map((item) => (cartLineId(item) === lineId ? { ...item, quantity } : item))
    );
  };

  // CLEAR CART: Empties the entire cart
  const clearCart = () => setCart([]);

  // ============================================================
  // COMPUTED VALUES (calculated from cart)
  // ============================================================

  // Cart count: Total number of items (sum of all quantities)
  // Example: [item1 qty:2, item2 qty:3] = cartCount of 5
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart total: Total price (price × quantity for each item, then sum all)
  // Example: [item1 $10×2=$20, item2 $15×3=$45] = cartTotal of $65
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ============================================================
  // PROVIDE CONTEXT TO CHILDREN
  // ============================================================

  // This Provider component wraps all child components
  // Any component that calls useCart() can access these values
  // The value object contains all state and functions that child components need
  return (
    <CartContext.Provider
      value={{
        cart,              // Current cart items
        isHydrated,        // Has localStorage been loaded?
        addToCart,         // Function to add items
        removeFromCart,    // Function to remove items
        updateQuantity,    // Function to change quantities
        clearCart,         // Function to empty cart
        cartCount,         // Total item count
        cartTotal,         // Total price
        isOpen,            // Is modal visible?
        openCart,          // Function to show modal
        closeCart,         // Function to hide modal
      }}
    >
      {/* All child components can now access these values via useCart() */}
      {children}

      {/* "Added to cart" message: sits at the bottom of the screen and never covers the page's buttons */}
      {notice && (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 z-[55] flex max-w-[calc(100vw-28px)] -translate-x-1/2 items-center gap-4 bg-[#111827] px-5 py-3 t-body text-white shadow-lg max-sm:bottom-20">
          <span className="min-w-0 truncate">{notice}</span>
          <Link href="/cart" onClick={() => setNotice(null)} className="flex-none t-w-700 text-[#7ad8e2] underline">View cart</Link>
        </div>
      )}
    </CartContext.Provider>
  );
}

// ============================================================
// CUSTOM HOOK: useCart()
// ============================================================

// This hook provides a simple way for any component to access cart data
// Instead of using useContext(CartContext) directly, components call useCart()
// This is cleaner and provides error handling
export function useCart() {
  // Get the context value
  const context = useContext(CartContext);

  // If context is undefined, it means useCart was called outside of CartProvider
  // This error helps developers catch mistakes
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  // Return the context value (all cart data and functions)
  return context;
}

// ============================================================
// ARCHITECTURE SUMMARY
// ============================================================

// WHY "use client"?
// ----------------------------------------
// 1. Uses React hooks (useState, useEffect, useCallback, useContext)
// 2. Server Components cannot use hooks
// 3. Only Client Components can manage interactivity and local state
// 4. Must run in the browser to access localStorage

// HOW IT FITS IN THE APP
// ----------------------------------------
// app/layout.tsx (Server Component)
//   └─ <CartProvider>  (Client Component - this file)
//        ├─ Page components (can be Server or Client)
//        ├─ <Navbar />   (uses useCart() to show item count)
//        ├─ <CartModal /> (Client Component, uses useCart())
//        └─ <CheckoutPage /> (Client Component, uses useCart())

// HYDRATION EXPLAINED
// ----------------------------------------
// 1. Server renders HTML with empty cart (server doesn't know localStorage)
// 2. Browser downloads HTML and JavaScript
// 3. JavaScript hydrates (attaches interactivity to HTML)
// 4. useEffect runs: localStorage is loaded
// 5. setIsHydrated(true) triggers re-render with actual cart data
// 6. Now client state matches server-rendered HTML (no hydration mismatch)

// PERSISTENCE FLOW
// ----------------------------------------
// User adds item → addToCart() → setCart() → cart state changes
// → useEffect detects cart change → localStorage.setItem() saves it
// → Page refresh → useEffect runs on mount → localStorage.getItem() loads it
// → setCart() restores cart → isHydrated=true → component re-renders

// CONTEXT PROVIDER PATTERN
// ----------------------------------------
// Avoid prop drilling: instead of passing cart through 10 levels of components,
// wrap the app in CartProvider and any component can call useCart() anywhere