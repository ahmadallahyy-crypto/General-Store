import type { Product } from "@/data/products";

export type Seller = {
  id: string;
  name: string;
  category: string;
  rating: number;
  followers: number;
  avatar: string;
  verified?: boolean;
  responseRate: number;
  joinedYear: number;
  totalProducts: number;
};

export type RatingBreakdown = { 5: number; 4: number; 3: number; 2: number; 1: number };

export type MarketplaceProduct = Product & {
  sellerId: string;
  brand: string;
  rating: number;
  reviewCount: number;
  ratingBreakdown: RatingBreakdown;
  delivery: "Same-day" | "1-2 days" | "Standard";
  paymentMethods: ("Paystack" | "COD")[];
  isOfficialStore?: boolean;
  isExpress?: boolean;
  freeShipping?: boolean;
  flashSale?: boolean;
  originalPrice?: number;
  stockLeft?: number;
  stockTotal?: number;
  saleEndsAt?: string;
};

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export type OrderItem = {
  productId: string;
  title: string;
  image: string;
  sellerId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
};
