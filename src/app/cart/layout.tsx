import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cart", description: "Review the items in your cart." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
