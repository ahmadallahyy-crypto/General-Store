"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { Discovery } from "@/components/discovery/discovery";
import { Card } from "@/components/home/product-card";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { defaultVariant, needsSize } from "@/data/product-variants";
import { getMarketplaceProduct } from "@/lib/mock/marketplace";

const action = "min-h-10 flex-1 border px-3 t-body t-w-700 transition";

export default function WishlistPage() {
  const { wishlist, isHydrated, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  if (!isHydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center t-body text-[#6b7280]">Loading your wishlist...</div>;
  }

  if (!wishlist.length) {
    return (
      <>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="t-hero t-w-700 text-[#111827]">Your wishlist is empty</h1>
          <p className="mt-2 t-body text-[#6b7280]">Tap the heart on any product to save it here for later.</p>
          <Link href="/search" className="mt-6 inline-flex min-h-12 items-center rounded-none bg-[#087f8c] px-6 t-body t-w-700 text-white hover:bg-[#0b6e78]">
            Start shopping
          </Link>
        </div>
        <Discovery />
      </>
    );
  }

  const clearAll = () => wishlist.forEach((item) => removeFromWishlist(item.id));
  const moveToCart = (id: string) => {
    const item = wishlist.find((p) => p.id === id);
    if (!item) return;
    // Products that need a size open their page so the shopper can choose one first.
    if (needsSize(item)) return router.push(`/product/${item.handle}#size-options`);
    addToCart(item, 1, defaultVariant(item));
    removeFromWishlist(id);
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="t-hero t-w-700 tracking-[-0.05em] text-[#111827]">Your wishlist</h1>
            <p className="mt-2 t-body text-[#6b7280]">{wishlist.length} saved item{wishlist.length === 1 ? "" : "s"}</p>
          </div>
          <button type="button" onClick={clearAll} className="min-h-10 border border-[#e5e7eb] bg-white px-4 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">Clear all</button>
        </div>

        {/* Same product grid as every page, with "Move to cart" and "Remove" under each card */}
        <div className="gs mt-8">
          <div className="feed flush">
            {wishlist.map((product) => {
              const item = getMarketplaceProduct(product.id);
              if (!item) return null;
              return (
                <div key={item.id} className="min-w-0">
                  <Card p={item} flash={item.flashSale} />
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => moveToCart(item.id)} className={`${action} border-[#dc2626] bg-[#dc2626] text-white hover:bg-[#b91c1c]`}>Move to cart</button>
                    <button type="button" onClick={() => removeFromWishlist(item.id)} aria-label={`Delete ${item.title} from your wishlist`} className={`${action} border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]`}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Discovery excludeIds={wishlist.map((item) => item.id)} />
    </>
  );
}
