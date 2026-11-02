import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sellers", description: "Browse trusted sellers and official stores." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
