import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout", description: "Complete your General-Store order." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
