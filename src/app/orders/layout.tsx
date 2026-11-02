import type { Metadata } from "next";

export const metadata: Metadata = { title: "My orders", description: "Track and review your orders." };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
