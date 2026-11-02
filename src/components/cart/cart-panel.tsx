"use client";

import Image from "@/components/ui/safe-image";
import { useCart, cartLineId } from "@/components/cart/cart-context";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/store-policies";
import { variantLabel } from "@/data/product-variants";
import Link from "next/link";
import "./cart-panel.css";

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function CartPanel() {
  const { cart, cartCount, cartTotal, isHydrated, updateQuantity, removeFromCart } = useCart();
  const cartCurrency = cart[0]?.currency ?? "USD";
  const count = isHydrated ? cartCount : 0;

  return (
    <aside aria-label="Cart">
      <div className="sub">
        Subtotal
        <br />
        <b>{money(isHydrated ? cartTotal : 0, cartCurrency)}</b>
      </div>
      <div className="note">Free delivery on orders over ${FREE_DELIVERY_THRESHOLD}</div>
      {count > 0 ? (
        <Link className="btn o" href="/checkout">
          Checkout ({count})
        </Link>
      ) : (
        <span className="btn o off" aria-disabled="true">
          Checkout (0)
        </span>
      )}
      <Link className="btn l" href="/cart">
        Go to cart
      </Link>
      <div className="sel">
        <span className="ck">✓</span>Your items ({count})
      </div>
      <div>
        {isHydrated && cart.length === 0 && <p className="empty">Your cart is empty. Tap + on any product.</p>}
        {isHydrated &&
          cart.map((item) => (
            <div className="ci" key={cartLineId(item)}>
              <div className="ph">
                <Image src={item.image} alt={item.title} fill sizes="220px" loading="lazy" quality={70} />
              </div>
              <span className="cn">
                {item.title}
                {item.variant && <small style={{ display: "block", fontWeight: 400, color: "var(--mute)" }}>{variantLabel(item.variant)}</small>}
              </span>
              <b>{money(item.price, item.currency)}</b>
              <select
                aria-label={`Quantity for ${item.title}`}
                value={item.quantity}
                onChange={(event) => updateQuantity(cartLineId(item), Number(event.target.value))}
              >
                {Array.from({ length: Math.max(9, item.quantity) }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button type="button" className="rm" onClick={() => removeFromCart(cartLineId(item))}>
                Remove
              </button>
            </div>
          ))}
      </div>
    </aside>
  );
}
