import { getFilteredProducts, products, type Product } from "@/data/products";
import { nextLagosMidnight } from "@/lib/dates";
import { didYouMean, suggestProducts } from "@/lib/search";
import type { MarketplaceProduct, Order, RatingBreakdown, Seller } from "@/lib/types";

const sellerNames = [
  "Nova Tech Hub", "Urban Thread Co.", "Homecraft Market", "General Store Official", "Bright Basket",
  "Pixel & Paper", "Daily Goods", "Nexus Select", "Coastal Finds", "The Style Room",
  "Prime Corner", "Studio Supply", "Luma Living", "QuickCart Store", "Everyday Depot",
];

const sellerCategories = ["Electronics", "Fashion", "Home", "Beauty", "Supermarket"];

export const sellers: Seller[] = sellerNames.map((name, index) => ({
  id: `seller-${index + 1}`,
  name,
  category: sellerCategories[index % sellerCategories.length],
  rating: Number((4.1 + (index % 9) / 10).toFixed(1)),
  followers: 120 + index * 347,
  avatar: `https://images.unsplash.com/photo-${["1556761175-b413da4baf72", "1556742049-0cfed4f6a45d", "1556740749-887f6717d7e4", "1556740758-90de374c12ad", "1556740738-b6a63e27c4df"][index % 5]}?w=160&h=160&fit=crop`,
  verified: index % 3 !== 1,
  responseRate: 82 + (index % 5) * 3,
  joinedYear: 2018 + (index % 7),
  totalProducts: 40 + index * 23,
}));

function ratingBreakdownFor(rating: number): RatingBreakdown {
  // Skew the histogram toward the average rating so totals stay internally consistent.
  const top = Math.min(78, Math.round(40 + rating * 8));
  const second = Math.min(100 - top, Math.round(30 - rating * 2));
  const third = Math.max(2, Math.round((100 - top - second) * 0.5));
  const fourth = Math.max(1, Math.round((100 - top - second - third) * 0.6));
  const fifth = Math.max(0, 100 - top - second - third - fourth);
  return { 5: top, 4: second, 3: third, 2: fourth, 1: fifth };
}

const deliveryOptions: MarketplaceProduct["delivery"][] = ["1-2 days", "Same-day", "Standard"];

// 12 official stores = two full rows of 6 on the Official Stores page.
export const officialStoreSellerIds = new Set([
  "seller-1", "seller-2", "seller-3", "seller-4", "seller-5", "seller-6",
  "seller-8", "seller-10", "seller-11", "seller-12", "seller-13", "seller-14",
]);

export const marketplaceProducts: MarketplaceProduct[] = products.map((product, index) => {
  const sellerId = sellers[index % sellers.length].id;
  const delivery = deliveryOptions[index % deliveryOptions.length];
  const flashSale = index % 5 === 0 || index % 7 === 0;
  const originalPrice = flashSale ? Number((product.price * 1.35).toFixed(2)) : undefined;
  const rating = Number((4 + (index % 10) / 10).toFixed(1));
  return {
    ...product,
    sellerId,
    brand: product.title.split(" ")[0],
    rating,
    reviewCount: 18 + index * 13,
    ratingBreakdown: ratingBreakdownFor(rating),
    delivery,
    paymentMethods: index % 2 === 0 ? ["Paystack", "COD"] : ["Paystack"],
    isOfficialStore: officialStoreSellerIds.has(sellerId),
    isExpress: delivery === "Same-day",
    freeShipping: index % 3 !== 0,
    flashSale,
    originalPrice,
    stockLeft: flashSale ? 3 + (index % 8) : undefined,
    stockTotal: flashSale ? 20 : undefined,
    // Demo: the daily flash sale ends at midnight Lagos time, so the countdown is the same on every visit that day.
    // A real back end supplies the true end time per deal.
    saleEndsAt: flashSale ? nextLagosMidnight() : undefined,
  };
});

export const flashSaleProducts = marketplaceProducts.filter((product) => product.flashSale).slice(0, 10);

export function getSeller(id: string) {
  return sellers.find((seller) => seller.id === id);
}

export function getMarketplaceProduct(id: string) {
  return marketplaceProducts.find((product) => product.id === id);
}

const orderProducts = marketplaceProducts.slice(0, 7);

export const orders: Order[] = [
  { id: "GS-10482", createdAt: "2026-09-02", status: "Shipped", total: 142.0, deliveryAddress: "12 Market Street, Lagos", items: orderProducts.slice(0, 2).map((product, index) => ({ productId: product.id, title: product.title, image: product.image, sellerId: product.sellerId, quantity: index + 1, price: product.price })) },
  { id: "GS-10461", createdAt: "2026-08-28", status: "Delivered", total: 85.0, deliveryAddress: "12 Market Street, Lagos", items: [orderProducts[2]].map((product) => ({ productId: product.id, title: product.title, image: product.image, sellerId: product.sellerId, quantity: 1, price: product.price })) },
  { id: "GS-10440", createdAt: "2026-08-21", status: "Pending", total: 127.0, deliveryAddress: "12 Market Street, Lagos", items: orderProducts.slice(3, 5).map((product) => ({ productId: product.id, title: product.title, image: product.image, sellerId: product.sellerId, quantity: 1, price: product.price })) },
  { id: "GS-10398", createdAt: "2026-08-13", status: "Cancelled", total: 20.0, deliveryAddress: "12 Market Street, Lagos", items: [orderProducts[5]].map((product) => ({ productId: product.id, title: product.title, image: product.image, sellerId: product.sellerId, quantity: 1, price: product.price })) },
  { id: "GS-10372", createdAt: "2026-08-04", status: "Delivered", total: 110.0, deliveryAddress: "12 Market Street, Lagos", items: [orderProducts[6]].map((product) => ({ productId: product.id, title: product.title, image: product.image, sellerId: product.sellerId, quantity: 1, price: product.price })) },
];

// Top deals for one brand/seller: flash-sale items first, then the best-rated of the
// remaining products, so every brand shows a full row (default 6 cards).
export function getTopDeals(items: MarketplaceProduct[], count = 6): MarketplaceProduct[] {
  const flash = items.filter((p) => p.flashSale);
  const rest = items
    .filter((p) => !p.flashSale)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  return [...flash, ...rest].slice(0, count);
}

// Most popular products (reviews x rating). Pass ids to leave out items already on the page.
export function getTrendingProducts(count = 6, excludeIds: string[] = []): MarketplaceProduct[] {
  const skip = new Set(excludeIds);
  return [...marketplaceProducts]
    .filter((p) => !skip.has(p.id))
    .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating)
    .slice(0, count);
}

// Popular search terms: the categories with the most customer reviews.
export function getTrendingSearches(count = 8): string[] {
  const totals = new Map<string, number>();
  for (const p of marketplaceProducts) totals.set(p.category, (totals.get(p.category) ?? 0) + p.reviewCount);
  return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, count).map(([category]) => category);
}

// ---------------------------------------------------------------------------
// Search API used by the pages. A back end replaces ONLY these three functions
// (e.g. calls its search service); the pages keep calling the same names.
// ---------------------------------------------------------------------------

// Brand and seller name are searchable too, so "nova" finds that store's products.
export function marketplaceSearchText(product: Product): string {
  const item = getMarketplaceProduct(product.id);
  const seller = item ? getSeller(item.sellerId) : undefined;
  return [item?.brand, seller?.name].filter(Boolean).join(" ");
}

export function searchCatalog(options: Parameters<typeof getFilteredProducts>[0]) {
  return getFilteredProducts({ ...options, extraText: marketplaceSearchText });
}

export function suggestCatalog(query: string, limit = 5) {
  return suggestProducts(products, query, limit, { extraText: marketplaceSearchText });
}

export function catalogDidYouMean(query: string) {
  return didYouMean(products, query, { extraText: marketplaceSearchText });
}
