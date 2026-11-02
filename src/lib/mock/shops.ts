import { getSeller, sellers } from "@/lib/mock/marketplace";
import type { Seller } from "@/lib/types";

// ============================================================
// SHOPS (demo data)
// ------------------------------------------------------------
// Two ideas are kept separate on purpose:
//   - CATEGORY = what a product is (Supermarket, Fashion ...). Lives on products, shown in the category strip.
//   - SHOP     = where / from whom you buy: a store type, a location, opening hours, delivery or pickup.
// "Shops near you" is a view over shops (filter by type, sort by distance). Supermarket exists in both:
// as a product category (groceries delivered to you) and as a shop type (supermarkets close to you).
//
// With a real back end each seller has these fields in the database (PostGIS point, hours, delivery
// radius, store type). Replace getShops() and nothing else changes.
// ============================================================

export type StoreType = "boutique" | "pharmacy" | "supermarket" | "electronics" | "home";

export const STORE_TYPES: { key: StoreType; label: string; singular: string; short: string }[] = [
  { key: "boutique", label: "Fashion boutiques", singular: "Fashion boutique", short: "Boutiques" },
  { key: "pharmacy", label: "Pharmacies", singular: "Pharmacy", short: "Pharmacies" },
  { key: "supermarket", label: "Supermarkets", singular: "Supermarket", short: "Supermarkets" },
  { key: "electronics", label: "Electronics shops", singular: "Electronics shop", short: "Electronics" },
  { key: "home", label: "Home and living", singular: "Home and living store", short: "Home" },
];

export type Shop = {
  sellerId: string;
  type: StoreType;
  area: string;
  city: string;
  lat: number;
  lng: number;
  delivers: boolean;
  pickup: boolean;
  /** How far from the shop it will deliver. */
  deliveryRadiusKm: number;
  opens: string; // "08:00"
  closes: string; // "20:00"
};

// Demo mapping from the seller's product category to a store type.
// "Beauty" stands in for pharmacies here; real data will carry an explicit store type.
const TYPE_BY_CATEGORY: Record<string, StoreType> = {
  Fashion: "boutique",
  Beauty: "pharmacy",
  Supermarket: "supermarket",
  Electronics: "electronics",
  Home: "home",
};

const HOURS: Record<StoreType, [string, string]> = {
  boutique: ["10:00", "19:00"],
  pharmacy: ["08:00", "21:00"],
  supermarket: ["07:00", "22:00"],
  electronics: ["09:00", "18:00"],
  home: ["09:00", "18:00"],
};

// Where each demo seller's shop is (Lagos and Abuja).
const LOCATIONS: [string, string, string, number, number, boolean, boolean, number][] = [
  // sellerId, area, city, lat, lng, delivers, pickup, deliveryRadiusKm
  ["seller-1", "Computer Village, Ikeja", "Lagos", 6.5965, 3.3421, true, true, 15],
  ["seller-2", "Yaba", "Lagos", 6.5095, 3.3711, true, true, 12],
  ["seller-3", "Surulere", "Lagos", 6.5, 3.35, true, false, 10],
  ["seller-4", "Victoria Island", "Lagos", 6.4281, 3.4219, true, true, 8],
  ["seller-5", "Lekki Phase 1", "Lagos", 6.4478, 3.4723, true, true, 8],
  ["seller-6", "Maryland", "Lagos", 6.5667, 3.3667, true, true, 12],
  ["seller-7", "Ikoyi", "Lagos", 6.4541, 3.4316, true, true, 10],
  ["seller-8", "Wuse 2", "Abuja", 9.0765, 7.4786, true, true, 12],
  ["seller-9", "Ajah", "Lagos", 6.4698, 3.5852, true, true, 8],
  ["seller-10", "Garki", "Abuja", 9.0333, 7.4833, true, true, 10],
  ["seller-11", "Maitama", "Abuja", 9.0833, 7.5, true, false, 15],
  ["seller-12", "Ogba", "Lagos", 6.628, 3.341, true, true, 10],
  ["seller-13", "Gwarinpa", "Abuja", 9.11, 7.4, true, true, 12],
  ["seller-14", "Utako", "Abuja", 9.069, 7.439, true, true, 8],
  ["seller-15", "Festac Town", "Lagos", 6.4667, 3.2833, true, true, 10],
];

export function getShops(): Shop[] {
  return LOCATIONS.flatMap(([sellerId, area, city, lat, lng, delivers, pickup, deliveryRadiusKm]) => {
    const seller = getSeller(sellerId);
    if (!seller) return [];
    const type = TYPE_BY_CATEGORY[seller.category] ?? "home";
    const [opens, closes] = HOURS[type];
    return [{ sellerId, type, area, city, lat, lng, delivers, pickup, deliveryRadiusKm, opens, closes }];
  });
}

export const getShopSeller = (shop: Shop): Seller | undefined => sellers.find((s) => s.id === shop.sellerId);
