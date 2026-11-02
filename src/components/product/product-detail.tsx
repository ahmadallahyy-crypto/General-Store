"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart, type CartVariant } from "@/components/cart/cart-context";
import { ProductFeed } from "@/components/grid/product-feed";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductReviews } from "@/components/product/product-reviews";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { getVariantOptions } from "@/data/product-variants";
import type { Product } from "@/data/products";
import { getCategoryLabel, getSubcategoryLabel } from "@/data/products";
import { formatEtaRange } from "@/lib/dates";
import { getMarketplaceProduct, getSeller, officialStoreSellerIds } from "@/lib/mock/marketplace";
import { getShops } from "@/lib/mock/shops";
import {
  FREE_DELIVERY_THRESHOLD,
  HOME_DELIVERY_DAYS,
  HOME_DELIVERY_ETA,
  PICKUP_DAYS,
  PICKUP_ETA,
  RETURN_WINDOW_DAYS,
  deliveryFee,
  formatMoney,
  type DeliveryMethodKey,
} from "@/lib/store-policies";
import "./product-detail.css";

const MAX_PER_ORDER = 10;
const SECTIONS = [
  ["details", "Product details"],
  ["specs", "Specifications"],
  ["feedback", "Customer reviews"],
  ["related", "Related products"],
  ["recent", "Recently viewed"],
] as const;

const feeText = (fee: number) => (fee === 0 ? "FREE" : formatMoney(fee));
const clock = (seconds: number) => [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((n) => String(n).padStart(2, "0")).join(":");

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" role="img" aria-label="Verified" className="pd-tick">
      <circle cx="12" cy="12" r="11" fill="#087f8c" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductDetail({ product, related, allProducts }: { product: Product; related: Product[]; allProducts: Product[] }) {
  const router = useRouter();
  const { addToCart, cartCount, cartTotal, isHydrated } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const market = getMarketplaceProduct(product.id);
  const seller = market ? getSeller(market.sellerId) : undefined;
  const shop = seller ? getShops().find((s) => s.sellerId === seller.id) : undefined;
  const verified = Boolean(seller && (seller.verified || officialStoreSellerIds.has(seller.id)));
  const images = useMemo(() => [...new Set([product.image, ...product.images])], [product]);
  const relatedProducts = useMemo(() => {
    const selected = related.slice(0, 6);
    if (selected.length === 6) return selected;

    const selectedIds = new Set(selected.map((item) => item.id));
    const additional = allProducts.filter((item) => item.id !== product.id && !selectedIds.has(item.id));
    return [...selected, ...additional.slice(0, 6 - selected.length)];
  }, [allProducts, product.id, related]);
  const options = getVariantOptions(product);

  // ---- what the shopper has chosen
  const [color, setColor] = useState(options.colors?.[0]?.name ?? "");
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [sizeHint, setSizeHint] = useState(false);
  const [quantityValue, setQuantityValue] = useState(1);
  const [delivery, setDelivery] = useState<DeliveryMethodKey>("pickup");
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [checkoutCartCount, setCheckoutCartCount] = useState<number | null>(null);
  // Dates and the sale clock depend on "now", so they are only worked out in the browser.
  const [now, setNow] = useState<Date | null>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const purchasePending = !isHydrated || checkoutCartCount !== null;

  const maxQty = Math.min(market?.stockLeft ?? MAX_PER_ORDER, MAX_PER_ORDER);
  const quantity = Math.min(quantityValue, maxQty);
  const subtotal = product.price * quantity;
  const fee = deliveryFee(delivery, cartTotal + subtotal);
  const homeFee = deliveryFee("standard", cartTotal + subtotal);

  useEffect(() => {
    const update = () => setNow(new Date());
    const frame = window.requestAnimationFrame(update);
    const id = setInterval(update, 1000);
    return () => {
      window.cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (checkoutCartCount === null || !isHydrated || cartCount < checkoutCartCount) return;
    const frame = window.requestAnimationFrame(() => {
      router.push("/checkout");
      setCheckoutCartCount(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [cartCount, checkoutCartCount, isHydrated, router]);

  // Arriving from a "+" button on a product that needs a size: jump to the sizes and say what to do next.
  useEffect(() => {
    if (options.sizes && /#size-options$/.test(window.location.hash)) {
      const frame = window.requestAnimationFrame(() => {
        setSizeHint(true);
        sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [product.id, options.sizes]);

  // Remember this product as "recently viewed" (also read by the keep-shopping sections on other pages).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("recentlyViewed") || "[]") as string[];
        const next = [product.id, ...saved.filter((id) => id !== product.id)].slice(0, 12);
        localStorage.setItem("recentlyViewed", JSON.stringify(next));
        setRecentIds(next.filter((id) => id !== product.id));
      } catch {
        setRecentIds([]);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [product.id]);

  // Highlight the tab of the section that is on screen.
  useEffect(() => {
    const nodes = SECTIONS.map(([id]) => document.getElementById(id)).filter((n): n is HTMLElement => Boolean(n));
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActiveTab(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  };

  const purchase = (buyNow: boolean) => {
    if (options.sizes && !size) {
      setSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      sizeRef.current?.focus();
      return;
    }
    const variant: CartVariant | undefined = size || color ? { size: size || undefined, color: color || undefined, sizeLabel: options.sizeLabel } : undefined;
    if (buyNow) setCheckoutCartCount(cartCount + quantity);
    addToCart(product, quantity, variant);
    // (the cart shows its own "added to cart" message)
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) return void (await navigator.share({ title: product.title, url }));
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast("Could not share. Copy the link from the address bar.");
    }
  };

  // ---- flash sale: only shown while a real end time is in the future
  const secondsLeft = market?.flashSale && market.saleEndsAt && now ? Math.max(0, Math.floor((new Date(market.saleEndsAt).getTime() - now.getTime()) / 1000)) : 0;
  const soldPercent = market?.flashSale ? Math.min(100, Math.round((((market.stockTotal ?? 20) - (market.stockLeft ?? 0)) / (market.stockTotal ?? 20)) * 100)) : 0;

  const categoryLabel = getCategoryLabel(product.category);
  // Some products have no subcategory: fall back to the category (the original page did the same).
  const subcategorySlug = product.subcategory || product.category;
  const subcategoryLabel = getSubcategoryLabel(product.category, subcategorySlug);
  const rating = market?.rating ?? 0;
  const dates = now ? { pickup: formatEtaRange(PICKUP_DAYS, now), home: formatEtaRange(HOME_DELIVERY_DAYS, now) } : null;
  const recent = recentIds.map((id) => allProducts.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));

  const specs: [string, string][] = [
    ["Brand", market?.brand ?? "General Store"],
    ["Category", categoryLabel],
    ["Item code", `GS-${product.id.padStart(4, "0")}`],
    ["Sold by", seller?.name ?? "Marketplace seller"],
    ...(options.colors ? [["Colours", options.colors.map((c) => c.name).join(", ")] as [string, string]] : []),
    ...(options.sizes ? [[options.sizeLabel ?? "Sizes", options.sizes.join(", ")] as [string, string]] : []),
    ["Delivery", `Pickup free · Home delivery ${formatMoney(deliveryFee("standard", 0))}, free over ${formatMoney(FREE_DELIVERY_THRESHOLD)}`],
    ["Returns", `${RETURN_WINDOW_DAYS} days on eligible items`],
  ];

  return (
    <div className="product-page">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <nav className="pd-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">›</span>
          <Link href={`/search/${product.category}`}>{categoryLabel}</Link>
          {subcategoryLabel !== categoryLabel && <><span aria-hidden="true">›</span><Link href={`/search/${product.category}/${subcategorySlug}`}>{subcategoryLabel}</Link></>}
          <span aria-hidden="true">›</span><span aria-current="page" className="pd-crumb-current">{product.title}</span>
        </nav>

        <div className="pd-grid">
          <ProductGallery images={images} title={product.title} badge={verified ? "Official store" : undefined} wished={isWishlisted(product.id)} onToggleWish={() => toggleWishlist(product)} />

          <div className="pd-aside">
            {/* ===== title, price, choices ===== */}
            <section className="pd-card pd-info" aria-label="Product information">
              <div className="pd-title-row">
                <h1>{product.title}</h1>
                <button type="button" className="pd-share" onClick={share} aria-label={`Share ${product.title}`}>Share</button>
              </div>
              <div className="pd-meta">
                {market && (<><span className="pd-stars" aria-label={`${rating} out of 5 stars`}>{"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}</span><a href="#feedback">{rating.toFixed(1)} ({market.reviewCount.toLocaleString("en-US")} ratings)</a></>)}
                {seller && <Link href={`/seller/${seller.id}`}>More from {seller.name}</Link>}
              </div>

              <div className="pd-price-block">
                <div className="pd-price-line">
                  <strong>{formatMoney(product.price)}</strong>
                  {market?.originalPrice && <><s>{formatMoney(market.originalPrice)}</s><span className="pd-discount">-{Math.round((1 - product.price / market.originalPrice) * 100)}%</span></>}
                </div>
                {secondsLeft > 0 && <div className="pd-flash"><span>Flash sale ends in</span><strong>{clock(secondsLeft)}</strong></div>}
                {market?.flashSale && (<><div className="pd-stock" role="progressbar" aria-label="Share of stock sold" aria-valuemin={0} aria-valuemax={100} aria-valuenow={soldPercent}><span style={{ width: `${soldPercent}%` }} /></div><div className="pd-stock-copy"><small>Only {market.stockLeft} left in stock</small><small>{soldPercent}% sold</small></div></>)}
                {market && !market.flashSale && <p className="pd-instock">In stock</p>}
              </div>

              {options.colors && (
                <>
                  <div className="pd-label">Colour:<span>{color}</span></div>
                  <div className="pd-options" role="group" aria-label="Colour options">
                    {options.colors.map(({ name, hex }) => (
                      <button type="button" key={name} style={{ backgroundColor: hex }} className={`pd-color ${color === name ? "is-selected" : ""}`} onClick={() => setColor(name)} aria-label={`${name} colour`} aria-pressed={color === name} />
                    ))}
                  </div>
                </>
              )}

              {options.sizes && (
                <>
                  <div className="pd-label">{options.sizeLabel ?? "Size"}<span className={sizeError ? "pd-error" : ""}>{size ? `Selected: ${size}` : "Selection required"}</span></div>
                  <div className="pd-options" id="size-options" ref={sizeRef} tabIndex={-1} role="group" aria-label={`${options.sizeLabel ?? "Size"} options`}>
                    {options.sizes.map((s) => (
                      <button type="button" key={s} disabled={options.unavailableSizes?.includes(s)} className={`pd-size ${size === s ? "is-selected" : ""}`} onClick={() => { setSize(s); setSizeError(false); }} aria-pressed={size === s}>{s}</button>
                    ))}
                  </div>
                  {sizeError && <p role="alert" className="pd-error">Please choose a {(options.sizeLabel ?? "size").toLowerCase()} first.</p>}
                  {sizeHint && !size && !sizeError && <p role="status" className="pd-hint">Choose a {(options.sizeLabel ?? "size").toLowerCase()}, then press Add to cart.</p>}
                </>
              )}

              <ul className="pd-perks">
                <li>Free pickup at stations. Free home delivery on orders over {formatMoney(FREE_DELIVERY_THRESHOLD)}</li>
                <li>{RETURN_WINDOW_DAYS}-day returns on eligible items · <Link href="/info/returns">Returns policy</Link></li>
                <li>Secure payment at checkout</li>
              </ul>
            </section>

            {/* ===== delivery, quantity, buy ===== */}
            <aside className="pd-card pd-buybox" aria-label="Purchase options">
              <div className="pd-label pd-label-first">Delivery</div>
              <div className="pd-delivery-options" role="radiogroup" aria-label="Delivery method">
                <label className={delivery === "pickup" ? "is-selected" : ""}>
                  <input type="radio" name="delivery-method" value="pickup" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} />
                  <span><strong>Pickup station <b>FREE</b></strong><small>Ready in {PICKUP_ETA}{dates ? ` · ${dates.pickup}` : ""}</small></span>
                </label>
                <label className={delivery === "standard" ? "is-selected" : ""}>
                  <input type="radio" name="delivery-method" value="standard" checked={delivery === "standard"} onChange={() => setDelivery("standard")} />
                  <span><strong>Home delivery <b>{feeText(homeFee)}</b></strong><small>Arrives in {HOME_DELIVERY_ETA}{dates ? ` · ${dates.home}` : ""}{homeFee > 0 ? ` · free over ${formatMoney(FREE_DELIVERY_THRESHOLD)}` : ""}</small></span>
                </label>
              </div>

              <div className="pd-quantity">
                <span id="qty-label">Quantity</span>
                <div role="group" aria-labelledby="qty-label">
                  <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantityValue((q) => Math.max(1, q - 1))}>−</button>
                  <output aria-live="polite">{quantity}</output>
                  <button type="button" aria-label="Increase quantity" disabled={quantity >= maxQty} onClick={() => setQuantityValue((q) => Math.min(maxQty, q + 1))}>+</button>
                </div>
              </div>

              <dl className="pd-summary">
                <div><dt>Item{quantity > 1 ? ` × ${quantity}` : ""}</dt><dd>{formatMoney(subtotal)}</dd></div>
                <div><dt>Delivery</dt><dd className={fee === 0 ? "is-free" : ""}>{feeText(fee)}</dd></div>
                <div className="pd-summary-total"><dt>Estimated total</dt><dd>{formatMoney(subtotal + fee)}</dd></div>
              </dl>
              <small className="pd-fine">Your final delivery fee is confirmed at checkout. {cartCount > 0 ? `${cartCount} in your cart.` : ""}</small>

              <button type="button" className="pd-button pd-primary" onClick={() => purchase(true)} disabled={purchasePending} aria-busy={checkoutCartCount !== null}>{checkoutCartCount !== null ? "Preparing checkout…" : "Buy now"}</button>
              <button type="button" className="pd-button pd-add" onClick={() => purchase(false)} disabled={purchasePending}>Add to cart</button>
            </aside>

            {/* ===== seller ===== */}
            {seller && (
              <section className="pd-card pd-seller" aria-label="Seller">
                <span className="pd-avatar" aria-hidden="true">{seller.name.charAt(0)}</span>
                <div className="pd-seller-info">
                  <strong>{seller.name}{verified && <Tick />}</strong>
                  <small>★ {seller.rating.toFixed(1)} · {seller.responseRate}% response rate</small>
                  {shop && <small>Shop in {shop.area}, {shop.city}</small>}
                </div>
                <Link href={`/seller/${seller.id}`} className="pd-visit">Visit shop</Link>
                <div className="pd-seller-links">
                  {shop?.pickup && <span>Pickup in store</span>}
                  <Link href="/shops">Shops near you</Link>
                  <Link href="/info/contact">Ask a question</Link>
                </div>
              </section>
            )}
          </div>
        </div>

        <nav className="pd-tabs" aria-label="Product sections">
          {SECTIONS.map(([id, label]) => <a key={id} className={activeTab === id ? "is-active" : ""} href={`#${id}`}>{label}</a>)}
        </nav>

        <section className="pd-card pd-section" id="details">
          <h2>Product details</h2>
          <p>{product.description}</p>
          {product.highlights && product.highlights.length > 0 && <ul className="pd-highlights">{product.highlights.map((item) => <li key={item}>{item}</li>)}</ul>}
          <div className="pd-return-policy">
            <h3>Return policy</h3>
            <p>Eligible items can be returned within {RETURN_WINDOW_DAYS} days of delivery. <Link href="/info/returns">Read the full returns policy</Link>.</p>
          </div>
        </section>

        <section className="pd-card pd-section" id="specs">
          <h2>Specifications</h2>
          <dl className="pd-specs">{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </section>

        <section className="pd-card pd-section" id="feedback">
          <h2>Customer reviews</h2>
          <ProductReviews handle={product.handle} summary={market ? { rating: market.rating, count: market.reviewCount, breakdown: market.ratingBreakdown } : undefined} />
        </section>

        <section className="pd-card pd-section" id="related">
          <div className="pd-section-heading"><h2>Related products</h2><Link href={`/search/${product.category}`}>See all</Link></div>
          {relatedProducts.length ? <div className="pd-feed"><ProductFeed products={relatedProducts} /></div> : <p className="pd-muted">No products to show yet.</p>}
        </section>

        <section className="pd-card pd-section" id="recent">
          <div className="pd-section-heading">
            <h2>Recently viewed</h2>
            {recent.length > 0 && <button type="button" className="pd-clear" onClick={() => { setRecentIds([]); try { localStorage.setItem("recentlyViewed", JSON.stringify([product.id])); } catch { /* storage can be unavailable */ } }}>Clear all</button>}
          </div>
          {recent.length ? <div className="pd-feed"><ProductFeed products={recent.slice(0, 6)} /></div> : <p className="pd-muted">Products you look at will show up here.</p>}
        </section>
      </div>

      {/* Phones: the buy buttons stay at the bottom of the screen */}
      <div className="pd-mobile-bar">
        <div><strong>{formatMoney(subtotal)}</strong><small>{delivery === "pickup" ? "Free pickup" : `Delivery ${feeText(fee)}`}</small></div>
        <button type="button" className="pd-button pd-add" onClick={() => purchase(false)} disabled={purchasePending}>Add</button>
        <button type="button" className="pd-button pd-primary" onClick={() => purchase(true)} disabled={purchasePending} aria-busy={checkoutCartCount !== null}>{checkoutCartCount !== null ? "Preparing…" : "Buy now"}</button>
      </div>
      <div className={`pd-toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
