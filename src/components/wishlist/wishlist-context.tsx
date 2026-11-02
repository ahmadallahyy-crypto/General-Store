"use client";

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { Product } from "@/data/products";
import { usePersistentState } from "@/lib/use-persistent-state";

type WishlistContextType = {
  wishlist: Product[];
  isHydrated: boolean;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  // Load the saved wishlist on mount and persist changes via the shared hook.
  const [wishlist, setWishlist, isHydrated] = usePersistentState<Product[]>(
    "acme-wishlist",
    []
  );

  const isWishlisted = useCallback(
    (id: string) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isHydrated,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
