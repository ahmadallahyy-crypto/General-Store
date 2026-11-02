"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/components/cart/cart-context";

export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className="w-full rounded-none bg-[#fef2f2] px-3 py-2 t-caption t-w-500 text-[#991b1b] transition hover:bg-[#fee2e2]"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="t-body t-w-500">Quantity</span>
        <div className="flex items-center rounded-none border border-neutral-200">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 t-16 hover:bg-neutral-50"
          >
            −
          </button>
          <span className="w-10 text-center t-body t-w-500">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2 t-16 hover:bg-neutral-50"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="w-full rounded-none bg-[#dc2626] py-3.5 t-body t-w-500 text-[var(--panel-strong)] transition-colors hover:bg-[#b91c1c]"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
