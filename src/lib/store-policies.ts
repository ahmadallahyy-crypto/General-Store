// Store rules in ONE place. Checkout, the cart, the cart panel and the policy pages all read these,
// so a change here shows up everywhere. When a back end exists, these can come from settings.

export const FREE_DELIVERY_THRESHOLD = 50; // order value that unlocks free home delivery
export const HOME_DELIVERY_FEE = 4.99;
export const RETURN_WINDOW_DAYS = 30;
// Delivery times as day ranges [fastest, slowest]. The text below and the dates shown on product pages are both built from these.
export const PICKUP_DAYS = [1, 2] as const;
export const HOME_DELIVERY_DAYS = [3, 5] as const;
export const PICKUP_ETA = `${PICKUP_DAYS[0]}–${PICKUP_DAYS[1]} days`;
export const HOME_DELIVERY_ETA = `${HOME_DELIVERY_DAYS[0]}–${HOME_DELIVERY_DAYS[1]} days`;

export type DeliveryMethodKey = "pickup" | "standard";

export function deliveryFee(method: DeliveryMethodKey, subtotal: number): number {
  if (method === "pickup") return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : HOME_DELIVERY_FEE;
}

export function amountToFreeDelivery(subtotal: number): number {
  return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
