import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiagnosticsPanel } from "@/components/diagnostics/diagnostics-panel";

export const metadata: Metadata = { title: "Diagnostics", robots: { index: false, follow: false } };

// Only available while developing (npm run dev). Production builds return a 404 unless NEXT_PUBLIC_DIAGNOSTICS=1.
export default function DiagnosticsPage() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DIAGNOSTICS !== "1") notFound();
  return <DiagnosticsPanel />;
}
