"use client";

import Image from "@/components/ui/safe-image";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { defaultVariant, needsSize } from "@/data/product-variants";
import type { MarketplaceProduct } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./product-card.css";

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const stars = (rating: number) => "\u2605".repeat(Math.round(rating)) + "\u2606".repeat(5 - Math.round(rating));

export function Card({ p, flash }: { p: MarketplaceProduct; flash?: boolean }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const chooseSize = needsSize(p);
  const quickAdd = () => (chooseSize ? router.push(`/product/${p.handle}#size-options`) : addToCart(p, 1, defaultVariant(p)));
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(p.id);
  const soldPct =
    flash && p.stockLeft !== undefined && p.stockTotal ? Math.round((1 - p.stockLeft / p.stockTotal) * 100) : 0;

  return (
    <div className="card">
      <div className="ph relative">
        <Link href={`/product/${p.handle}`} prefetch={false} className="ph-link" aria-label={p.title}>
          <Image src={p.image} alt={p.title} fill sizes="(max-width:640px) 46vw, (max-width:1100px) 33vw, 20vw" loading="lazy" quality={70} />
        </Link>
        <button
          type="button"
          className="fav"
          aria-label={saved ? `Remove ${p.title} from wishlist` : `Save ${p.title} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(p)}
        >
          {saved ? "♥" : "♡"}
        </button>
        <button type="button" className="add" aria-label={chooseSize ? `Choose a size for ${p.title}` : `Add ${p.title} to cart`} title={chooseSize ? "Choose a size" : "Add to cart"} onClick={quickAdd}>
          +
        </button>
        {flash && p.stockLeft !== undefined && <span className="pill">ONLY {p.stockLeft} LEFT</span>}
      </div>
      <Link href={`/product/${p.handle}`} prefetch={false} className="nm">
        {p.title}
      </Link>
      <div className="pr">
        <b>{money(p.price, p.currency)}</b>
        {p.originalPrice && <s>{money(p.originalPrice, p.currency)}</s>}
      </div>
      <div className="st" aria-label={`Rated ${p.rating} out of 5`}>
        {stars(p.rating)}
        <small>{p.reviewCount}</small>
      </div>
      {flash && (
        <div className="bar">
          <i style={{ width: `${soldPct}%` }} />
        </div>
      )}
    </div>
  );
}
