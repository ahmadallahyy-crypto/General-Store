import type { CartVariant } from "@/components/cart/cart-context";

// ============================================================
// PRODUCT OPTIONS (size and colour)
// ------------------------------------------------------------
// Which choices a shopper makes before adding a product to the cart. Today they come from the product's
// category (below). With a real back end each product carries its own variants and stock per variant;
// then `getVariantOptions` simply reads that, and nothing else changes.
// ============================================================

export type ColorOption = { name: string; hex: string };
export type VariantOptions = {
  /** Heading for the size picker ("Size", "Shoe size", "Age"). Present only when a size must be chosen. */
  sizeLabel?: string;
  sizes?: string[];
  colors?: ColorOption[];
  /** Sizes that are out of stock. Empty for now; the back end fills it per product. */
  unavailableSizes?: string[];
};

const c = (name: string, hex: string): ColorOption => ({ name, hex });
const BLACK = c("Black", "#111827");
const WHITE = c("White", "#ffffff");
const NAVY = c("Navy", "#1e3a8a");
const GREY = c("Grey", "#9ca3af");
const OLIVE = c("Olive", "#4d5d36");
const TAN = c("Tan", "#c8a97e");
const BLUE = c("Blue", "#2563eb");
const PINK = c("Pink", "#f9a8d4");
const YELLOW = c("Yellow", "#fde047");
const SILVER = c("Silver", "#d1d5db");

const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"];

export const CATEGORY_VARIANTS: Record<string, VariantOptions> = {
  shirts: { sizeLabel: "Size", sizes: CLOTHING_SIZES, colors: [BLACK, WHITE, NAVY, GREY] },
  hoodies: { sizeLabel: "Size", sizes: CLOTHING_SIZES, colors: [BLACK, GREY, NAVY, OLIVE] },
  jackets: { sizeLabel: "Size", sizes: CLOTHING_SIZES, colors: [BLACK, OLIVE, NAVY] },
  kids: { sizeLabel: "Age", sizes: ["0–3 months", "3–6 months", "6–12 months", "1–2 years", "2–3 years"], colors: [PINK, BLUE, WHITE, YELLOW] },
  footwear: { sizeLabel: "Shoe size (EU)", sizes: ["40", "41", "42", "43", "44", "45"], colors: [BLACK, WHITE, GREY] },
  headwear: { colors: [BLACK, TAN, NAVY] },
  bags: { colors: [BLACK, TAN, NAVY] },
  drinkware: { colors: [WHITE, BLACK, BLUE] },
  phones: { colors: [BLACK, BLUE, SILVER] },
  electronics: { colors: [BLACK, WHITE] },
};

type HasOptions = { category: string };

export const getVariantOptions = (product: HasOptions): VariantOptions => CATEGORY_VARIANTS[product.category] ?? {};

/** True when the shopper must pick a size before the product can go in the cart. */
export const needsSize = (product: HasOptions) => Boolean(getVariantOptions(product).sizes?.length);

/** What a one-tap "add" uses: the first colour (if any). Products that need a size are never added without one. */
export function defaultVariant(product: HasOptions): CartVariant | undefined {
  const color = getVariantOptions(product).colors?.[0]?.name;
  return color ? { color } : undefined;
}

/** "Size: M · Black", for cart lines and order summaries. */
export function variantLabel(variant?: CartVariant): string {
  if (!variant) return "";
  return [variant.size && `${variant.sizeLabel ?? "Size"}: ${variant.size}`, variant.color].filter(Boolean).join(" · ");
}
