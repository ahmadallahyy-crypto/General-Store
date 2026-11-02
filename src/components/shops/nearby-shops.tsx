"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SellerPhotoCard, SellerPhotoGrid } from "@/components/marketplace/seller-photo-grid";
import { useUserLocation, type LocationStatus } from "@/components/shops/use-user-location";
import { CITY_CENTERS, distanceKm, formatDistance, openStatus } from "@/lib/geo";
import { marketplaceProducts, officialStoreSellerIds } from "@/lib/mock/marketplace";
import { STORE_TYPES, getShopSeller, getShops, type StoreType } from "@/lib/mock/shops";
import "./nearby-shops.css";

type Props = {
  /** Show only this many shops, with a "see all" link (used on All products and category pages). */
  limit?: number;
  /** Lock the list to one store type and hide the type chips (e.g. supermarkets on the Supermarket category). */
  lockType?: StoreType;
  title?: string;
  subtitle?: string;
  headingLevel?: "h1" | "h2";
};

const RADII = [5, 10, 25, 50, 0]; // 0 = any distance

const STATUS_MESSAGE: Partial<Record<LocationStatus, string>> = {
  denied: "Location is blocked in your browser. Choose your city below instead, or allow location in the browser's site settings.",
  unavailable: "We could not work out where you are. Choose your city below instead.",
  timeout: "Finding your location took too long. Try again, or choose your city below.",
  unsupported: "This browser cannot share its location. Choose your city below instead.",
};

const select = "min-h-10 rounded-none border border-[#e5e7eb] bg-white px-3 t-body text-[#111827] outline-none focus:border-[#087f8c]";
const chipBase = "inline-flex min-h-10 items-center gap-2 border px-4 t-body transition";

/**
 * "Shops near you": browse local shops by type (boutiques, pharmacies, supermarkets ...), closest first.
 * The shopper either shares their location (the browser asks first) or picks a city.
 * Distances are straight-line. With a real back end, the server can do the sorting and filtering.
 */
export function NearbyShops({ limit, lockType, title = "Shops near you", subtitle = "Boutiques, pharmacies, supermarkets and more, closest first.", headingLevel = "h2" }: Props) {
  const { location, isHydrated, status, requestGps, chooseCity, clear } = useUserLocation();
  const [type, setType] = useState<StoreType | "all">(lockType ?? "all");
  const [radius, setRadius] = useState(25);
  const [now, setNow] = useState<Date | null>(null);

  // Opening hours depend on the shopper's clock, so they are worked out in the browser only.
  useEffect(() => {
    const update = () => setNow(new Date());
    const frame = window.requestAnimationFrame(update);
    const id = setInterval(update, 60_000);
    return () => {
      window.cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  const all = useMemo(
    () =>
      getShops().flatMap((shop) => {
        const seller = getShopSeller(shop);
        return seller ? [{ shop, seller, km: location ? distanceKm(location, shop) : null }] : [];
      }),
    [location]
  );

  const inRange = all.filter((row) => !lockType || row.shop.type === lockType).filter((row) => row.km === null || radius === 0 || row.km <= radius);
  const counts = (key: StoreType | "all") => inRange.filter((row) => key === "all" || row.shop.type === key).length;
  const rows = inRange
    .filter((row) => type === "all" || row.shop.type === type)
    .sort((a, b) => (a.km !== null && b.km !== null ? a.km - b.km : b.seller.rating - a.seller.rating));
  const shown = limit ? rows.slice(0, limit) : rows;
  const typeLabel = STORE_TYPES.find((t) => t.key === type)?.label.toLowerCase() ?? "shops";
  const Title = headingLevel;

  return (
    <section aria-labelledby="nearby-shops-title" className="border border-[#e2f7f9] bg-[#f8fbff] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#087f8c]">Local shops</p>
          <Title id="nearby-shops-title" className={`mt-1 ${headingLevel === "h1" ? "t-title-page" : "t-title-section"} t-w-700 text-[#111827]`}>{title}</Title>
          <p className="mt-1 t-body text-[#4b5563]">{subtitle}</p>
        </div>
        {limit && rows.length > 0 && <Link href="/shops" className="t-body t-w-700 text-[#087f8c]">See all {rows.length} shops →</Link>}
      </div>

      {/* ===== where are you? ===== */}
      {isHydrated && (
        <div className="mt-4 border border-[#e5e7eb] bg-white p-4">
          {!location ? (
            <>
              <p className="t-body t-w-700 text-[#111827]">Find shops close to you</p>
              <p className="mt-1 t-caption text-[#6b7280]">Your browser will ask before sharing your location. It stays on this device and is only used to sort shops by distance.</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" onClick={requestGps} disabled={status === "asking"} className="min-h-10 bg-[#087f8c] px-5 t-body t-w-700 text-white transition hover:bg-[#0b6e78] disabled:opacity-70">
                  {status === "asking" ? "Finding you..." : "Use my location"}
                </button>
                <span className="t-caption text-[#6b7280]">or</span>
                <label className="sr-only" htmlFor={`city-${lockType ?? "all"}`}>Choose your city</label>
                <select id={`city-${lockType ?? "all"}`} value="" onChange={(e) => chooseCity(e.target.value)} className={select}>
                  <option value="" disabled>Choose your city</option>
                  {CITY_CENTERS.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
                </select>
              </div>
              {STATUS_MESSAGE[status] && <p role="alert" className="mt-3 t-caption text-[#b45309]">{STATUS_MESSAGE[status]}</p>}
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="t-body text-[#111827]">Showing shops near <span className="t-w-700">{location.label}</span>{location.source === "gps" ? " (your location)" : ""}</p>
              <button type="button" onClick={requestGps} disabled={status === "asking"} className="t-body t-w-700 text-[#087f8c] disabled:opacity-60">{status === "asking" ? "Finding you..." : "Use my location"}</button>
              <label className="sr-only" htmlFor={`city-change-${lockType ?? "all"}`}>Change city</label>
              <select id={`city-change-${lockType ?? "all"}`} value="" onChange={(e) => chooseCity(e.target.value)} className={select}>
                <option value="" disabled>Change city</option>
                {CITY_CENTERS.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
              </select>
              {!limit && (
                <label className="flex items-center gap-2 t-body text-[#374151]">Within
                  <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className={select}>
                    {RADII.map((r) => <option key={r} value={r}>{r === 0 ? "Any distance" : `${r} km`}</option>)}
                  </select>
                </label>
              )}
              <button type="button" onClick={clear} className="t-caption text-[#6b7280] underline">Forget my location</button>
              {STATUS_MESSAGE[status] && <p role="alert" className="w-full t-caption text-[#b45309]">{STATUS_MESSAGE[status]}</p>}
            </div>
          )}
        </div>
      )}

      {/* ===== what kind of shop? ===== */}
      {!lockType && (
        <div role="group" aria-label="Shop type" className="mt-4 flex flex-wrap gap-2">
          {[{ key: "all" as const, short: "All shops" }, ...STORE_TYPES].map((t) => (
            <button key={t.key} type="button" aria-pressed={type === t.key} onClick={() => setType(t.key)} className={`${chipBase} ${type === t.key ? "border-[#087f8c] bg-[#087f8c] text-white" : "border-[#e5e7eb] bg-white text-[#374151] hover:border-[#087f8c]"}`}>
              {t.short}<span className={`t-caption ${type === t.key ? "text-white" : "text-[#6b7280]"}`}>{counts(t.key)}</span>
            </button>
          ))}
        </div>
      )}

      {/* ===== the shops ===== */}
      {shown.length === 0 ? (
        <div className="mt-4 border border-dashed border-[#cbd5e1] bg-white p-6 text-center">
          <p className="t-body t-w-700 text-[#111827]">No {typeLabel} found{location && radius ? ` within ${radius} km` : ""}.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {radius !== 0 && <button type="button" onClick={() => setRadius(0)} className="min-h-10 bg-[#087f8c] px-5 t-body t-w-700 text-white hover:bg-[#0b6e78]">Show any distance</button>}
            {type !== "all" && !lockType && <button type="button" onClick={() => setType("all")} className="min-h-10 border border-[#e5e7eb] bg-white px-5 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">Show all shop types</button>}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <SellerPhotoGrid className="nearby-shop-grid">
            {shown.map(({ shop, seller, km }) => {
              const hours = now ? openStatus(shop.opens, shop.closes, now) : null;
              const reaches = km !== null && shop.delivers && km <= shop.deliveryRadiusKm;
              const typeInfo = STORE_TYPES.find((t) => t.key === shop.type);
              const cover = marketplaceProducts.find((p) => p.sellerId === seller.id);
              const verified = seller.verified || officialStoreSellerIds.has(seller.id);
              return (
                <SellerPhotoCard
                  key={shop.sellerId}
                  seller={seller}
                  image={cover?.image ?? seller.avatar}
                  bannerTitle={typeInfo?.singular ?? "Shop"}
                  bannerSubtitle={`${shop.area}, ${shop.city}`}
                  badge={km !== null ? formatDistance(km) : undefined}
                  verified={verified}
                  bannerAspect="wide"
                  imageFit="cover"
                  details={
                    <>
                      <span><em>★</em> {seller.rating.toFixed(1)} · {seller.totalProducts} products</span>
                      {hours && <span className={hours.open ? "nearby-shop-open" : "nearby-shop-closed"}>{hours.label}</span>}
                    </>
                  }
                  footer={
                    <>
                      <div className="nearby-shop-card__tags">
                        {shop.delivers && <span className={`tag ${reaches ? "ok" : ""}`}>{reaches ? "Delivers to you" : `Delivers within ${shop.deliveryRadiusKm} km`}</span>}
                        {shop.pickup && <span className="tag">Pickup in store</span>}
                      </div>
                      <div className="nearby-shop-card__actions">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`} target="_blank" rel="noopener noreferrer" aria-label={`Directions to ${seller.name} (opens Google Maps)`}>Directions</a>
                        {shop.type === "supermarket" && <Link href="/search/supermarket">Shop groceries online</Link>}
                      </div>
                    </>
                  }
                />
              );
            })}
          </SellerPhotoGrid>
        </div>
      )}
    </section>
  );
}
