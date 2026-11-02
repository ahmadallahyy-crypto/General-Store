import type { Metadata } from "next";

export const metadata: Metadata = { title: "Local stores", description: "Find boutiques, pharmacies, supermarkets and more close to you." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
