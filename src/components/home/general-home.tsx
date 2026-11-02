"use client";

import { searchCatalog } from "@/lib/mock/marketplace";
import Image from "@/components/ui/safe-image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryGroup } from "@/data/products";
import type { MarketplaceProduct, Seller } from "@/lib/types";
import { readRecentSearches } from "@/lib/recent-searches";
import { CartPanel } from "@/components/cart/cart-panel";
import { Card } from "@/components/home/product-card";
import "./general-home.css";

type Props = {
  products: MarketplaceProduct[];
  flashProducts: MarketplaceProduct[];
  sellers: Seller[];
  groups: CategoryGroup[];
};

const SLIDES = [
  { bg: "#ffc98a", title: "Flash deals, today only", text: "Limited stock at lower prices.",   cta: "Shop deals", href: "#flash", cat: "flash" },
    { bg: "#bfe3d4", title: "Fresh for the home", text: "Bags, drinkware and everyday picks.", cta: "Shop home", href: "/search/home-office", cat: "home-office" },
    { bg: "#f6c3d0", title: "New season fashion", text: "Clothing, shoes and bags.", cta: "Shop fashion", href: "/search/fashion", cat: "fashion" },
];

const QUICK_LINKS = [
  { label: "Official stores", href: "/search/official-store", icon: "M3 10h18M5 10V6h14v4M5 10v10h14V10M9 20v-6h6v6" },
  { label: "Deals", href: "#flash", icon: "M20 12 12 20H5l-2-8 8-9h7l3 3v6ZM8 8h.01M14 8l-4 8m5-4h.01" },
  { label: "Wishlist", href: "/wishlist", icon: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" },
  { label: "Cart", href: "/cart", icon: "M2 3h3l2.5 12h10L20 7H6M9 20h.01M17 20h.01" },
  { label: "Sellers", href: "/sellers", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6m3-3h-6" },
  { label: "Track order", href: "/orders", icon: "M3 7h11v11H3zM14 11h4l3 3v4h-7zM7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" },
  { label: "Checkout", href: "/checkout", icon: "M3 5h18v14H3zM3 10h18M7 15h4" },
  { label: "All products", href: "/search", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
];

const PAGE_SIZE = 18; // multiple of 6, so every row is complete before "See more"

const PROMOS: Record<string, { bg: string; line: string }> = {
  appliances: { bg: "#e2f7f9", line: "Upgrade your kitchen and home" },
  "phones-tablets": { bg: "#e7f8fa", line: "Stay connected for less" },
  "health-beauty": { bg: "#fce7f3", line: "Look and feel your best" },
  "home-office": { bg: "#d1fae5", line: "Make your space work for you" },
  electronics: { bg: "#d9f5f7", line: "Gadgets and gear at great prices" },
  fashion: { bg: "#fde2e4", line: "New styles, every season" },
  supermarket: { bg: "#fef3c7", line: "Everyday essentials, delivered" },
  "baby-products": { bg: "#ede9fe", line: "Everything for little ones" },
};
const FALLBACK_PROMO = { bg: "#e5e7eb", line: "Handpicked for you" };

const SELLER_TAGS: Record<string, { line: string; sub: string }> = {
  Electronics: { line: "Latest Tech. Better Living.", sub: "Gadgets • Phones • Accessories" },
  Fashion: { line: "Style For Every You", sub: "Men • Women • Kids" },
  Home: { line: "Modern Homes Better Living", sub: "Furniture • Decor • Lifestyle" },
  Beauty: { line: "Beauty Looks Good On You", sub: "Skincare • Makeup • Fragrance" },
  Supermarket: { line: "Fresh Choices Everyday", sub: "Groceries • Home Essentials • More" },
};

function Rail({ children, variant = "rail" }: { children: React.ReactNode; variant?: "rail" | "chips" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8 });

  return (
    <div className={`railwrap ${variant === "chips" ? "inline" : ""}`}>
      <div className={variant} ref={ref}>
        {children}
      </div>
      {!edge.start && (
        <button className="arrow prev" type="button" aria-label="Scroll left" onClick={() => go(-1)}>
          &#8249;
        </button>
      )}
      {!edge.end && (
        <button className="arrow next" type="button" aria-label="Scroll right" onClick={() => go(1)}>
          &#8250;
        </button>
      )}
    </div>
  );
}
function endOfDaySeconds() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
}

export function GeneralHome({ products, flashProducts, sellers, groups }: Props) {
  const [slide, setSlide] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [cat, setCat] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRecent(readRecentSearches()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (carouselPaused || window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [carouselPaused]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSecondsLeft(endOfDaySeconds()));
    const id = setInterval(() => setSecondsLeft(endOfDaySeconds()), 1000);
    return () => {
      window.cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  const timer =
    secondsLeft === null
      ? "--:--:--"
      : [(secondsLeft / 3600) | 0, ((secondsLeft % 3600) / 60) | 0, secondsLeft % 60]
          .map((v) => String(v).padStart(2, "0"))
          .join(":");

  const chipGroups = useMemo(
    () => groups.filter((g) => products.some((p) => g.categories.includes(p.category))),
    [groups, products],
  );

  const feed = useMemo(() => {
    if (cat === "all") return [...products].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    const group = groups.find((g) => g.slug === cat);
    return group ? products.filter((p) => group.categories.includes(p.category)) : products;
  }, [cat, groups, products]);

  // Same search engine as the results page, so "recently searched" matches agree with what a search shows.
  const recentMatches = useMemo(() => {
    const q = recent[0];
    if (!q) return [];
    const rank = new Map(searchCatalog({ query: q }).map((p, i) => [p.id, i] as const));
    return products
      .filter((p) => rank.has(p.id))
      .sort((a, b) => rank.get(a.id)! - rank.get(b.id)!)
      .slice(0, 8);
  }, [recent, products]);

  const promoGroups = useMemo(
    () =>
      chipGroups
        .filter((g) => g.slug !== "official-store")
        .map((g) => ({ g, items: products.filter((p) => g.categories.includes(p.category)).slice(0, 8) }))
        .filter((x) => x.items.length >= 2)
        .slice(0, 5),
    [chipGroups, products],
  );

  const topSellers = useMemo(() => [...sellers].sort((a, b) => b.followers - a.followers).slice(0, 6), [sellers]);

  const menuGroups = groups.filter((g) => g.slug !== "official-store").slice(0, 7);

  return (
    <div className="gs">
      <div className="layout">
        <div className="main">
          <section className="hero">
            <ul className="menu">
              {menuGroups.map((g) => (
                <li key={g.slug}>
                  <Link href={`/search/${g.slug}`}>{g.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/search">See all categories</Link>
              </li>
            </ul>
            <div className="slider">
              {SLIDES.map((s, i) => {
                const group = groups.find((g) => g.slug === s.cat);
                const pic =
                  s.cat === "flash"
                    ? flashProducts[0]
                    : products.find((p) => group?.categories.includes(p.category));
                return (
                <div
                  key={s.title}
                  className={`slide${i === slide ? " on" : ""}`}
                  style={{ background: s.bg, ["--sl-bg" as string]: s.bg }}
                  aria-hidden={i !== slide}
                >
                  {pic && (
                    <div className="sl-img">
                      <Image src={pic.image} alt="" fill preload={i === 0} sizes="(max-width:900px) 100vw, 60vw" />
                    </div>
                  )}
                  <h1>{s.title}</h1>
                  <p>{s.text}</p>
                  <Link href={s.href} tabIndex={i === slide ? 0 : -1}>
                    {s.cta}
                  </Link>
                </div>
                );
              })}
              <div className="dots">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    aria-pressed={i === slide}
                    className={i === slide ? "on" : ""}
                    onClick={() => setSlide(i)}
                  />
                ))}
                <button
                  type="button"
                  className="carousel-toggle"
                  aria-label={carouselPaused ? "Resume carousel" : "Pause carousel"}
                  aria-pressed={carouselPaused}
                  onClick={() => setCarouselPaused((paused) => !paused)}
                >
                  {carouselPaused ? "Play" : "Pause"}
                </button>
              </div>
            </div>
            <div className="side">
              <Link href="/sellers">
                <b>Sell with us</b>
                <span>Browse our sellers</span>
              </Link>
              <Link href="/checkout">
                <b>Pay on delivery</b>
                <span>Selected items</span>
              </Link>
              <Link href="/orders">
                <b>Track your order</b>
                <span>See where it is</span>
              </Link>
            </div>
          </section>

          <section className="icons">
            {QUICK_LINKS.map((l) => (
              <Link key={l.label} href={l.href}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d={l.icon} />
                </svg>
                {l.label}
              </Link>
            ))}
          </section>

          <div className="fh" id="flash">
            <span>
              Flash sales &nbsp;<span className="t">{timer}</span> left
            </span>
            <Link href="/search">See all</Link>
          </div>
          <section className="row">
            <Rail>{flashProducts.map((p) => (<Card key={p.id} p={p} flash />))}</Rail>
          </section>

          {recent.length > 0 && (
            <>
              <h2 className="ex b">Recently searched</h2>
              <Rail variant="chips">
                {recent.map((s) => (
                  <Link key={s} className="chip" href={`/search?q=${encodeURIComponent(s)}`}>
                    {s}
                  </Link>
                ))}
              </Rail>
              {recentMatches.length > 0 && (
                <section className="row">
                  <Rail>
                    {recentMatches.map((p) => (
                      <Card key={p.id} p={p} />
                    ))}
                  </Rail>
                </section>
              )}
            </>
          )}

          {promoGroups.map(({ g, items }) => {
            const promo = PROMOS[g.slug] ?? FALLBACK_PROMO;
            return (
              <section key={g.slug} className="cat">
                <div className="strip" style={{ background: promo.bg }}>
                  <div>
                    <b>{g.title}</b>
                    <span>{promo.line}</span>
                  </div>
                  <Link href={`/search/${g.slug}`}>Shop {g.title}</Link>
                </div>
                <div className="row">
                  <Rail>
                    {items.map((p) => (
                      <Card key={p.id} p={p} />
                    ))}
                  </Rail>
                </div>
              </section>
            );
          })}

          <div className="tsh">
            <h2 className="ex b">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" /></svg>
              Top sellers
            </h2>
            <Link href="/sellers" className="tsa">
              View all sellers
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div className="sellers">
            {topSellers.map((s, i) => {
              const cover = products.find((p) => p.sellerId === s.id) ?? products[i];
              const tag = SELLER_TAGS[s.category] ?? { line: "Great picks, trusted seller", sub: s.category };
              return (
                <Link key={s.id} href={`/seller/${s.id}`}>
                  <div className="sb">
                    {cover && <Image src={cover.image} alt="" fill sizes="(max-width:640px) 100vw, 33vw" />}
                    <div className="sbt">
                      <strong>{tag.line}</strong>
                      <small>{tag.sub}</small>
                    </div>
                    <span className="rk">{i + 1}</span>
                  </div>
                  <div className="sc">
                    <span className="av" aria-hidden="true">{s.name.charAt(0)}</span>
                    <div className="si">
                      <b>
                        {s.name}
                        {s.verified && (
                          <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Verified" role="img"><circle cx="12" cy="12" r="11" fill="#087f8c" /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </b>
                      <span>
                        <em>★</em> {s.rating.toFixed(1)} ({new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(s.followers)} Followers)
                      </span>
                      <span>{s.totalProducts} products</span>
                    </div>
                    <span className="go" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <h2 className="ex b">Explore your interests</h2>
          <Rail variant="chips">
            {[{ slug: "all", title: "Recommended" }, ...chipGroups].map((g) => (
              <button
                key={g.slug}
                type="button"
                className={g.slug === cat ? "on" : ""}
                onClick={() => {
                  setCat(g.slug);
                  setVisible(PAGE_SIZE);
                }}
              >
                {g.title}
              </button>
            ))}
          </Rail>
          <div className="feed">
            {feed.slice(0, visible).map((p) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
          {visible < feed.length && (
            <button className="more" type="button" onClick={() => setVisible((v) => v + 12)}>
              See more
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}

          <div className="vp">
            <div>
              <b>Fast delivery</b>
              <span>To your door or a pickup station</span>
            </div>
            <div>
              <b>Easy returns</b>
              <span>Return within 7 days</span>
            </div>
            <div>
              <b>Secure payment</b>
              <span>Card or pay on delivery</span>
            </div>
            <div>
              <b>Support</b>
              <span>Help when you need it</span>
            </div>
          </div>
        </div>

        <CartPanel />
      </div>
    </div>
  );
}
