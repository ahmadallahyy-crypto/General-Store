"use client"; // Client component: needed for useState and onClick

// File: src/app/orders/page.tsx  ->  URL: /orders (list of all orders)

// ---------- Imports ----------
import Image from "@/components/ui/safe-image";
import Link from "next/link"; // Page navigation without a full reload
import { useMemo, useState } from "react"; // useState remembers a value, useMemo caches a calculation
import { Discovery } from "@/components/discovery/discovery";
import { getSeller, orders } from "@/lib/mock/marketplace"; // Fake orders data + seller lookup helper
import type { OrderStatus } from "@/lib/types"; // Allowed status values (Pending, Shipped, ...)

// ---------- Constants ----------

// Filter tabs: "All" plus every real status
const tabs: ("All" | OrderStatus)[] = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

// Badge colors, one entry per status
const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-[#fef3c7] text-[#92400e]", // yellow
  Shipped: "bg-[#e2f7f9] text-[#0b6e78]", // blue
  Delivered: "bg-[#dcfce7] text-[#166534]", // green
  Cancelled: "bg-[#f3f4f6] text-[#4b5563]", // gray
};

// ---------- Page ----------
export default function OrdersPage() {
  // Selected tab. Starts as "All"; setTab changes it.
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  // Orders to show: everything for "All", otherwise only matching statuses.
  // Recalculates only when "tab" changes.
  const filtered = useMemo(
    () => (tab === "All" ? orders : orders.filter((order) => order.status === tab)),
    [tab]
  );

  return (
    <>
    {/* Page wrapper: centered, max width, responsive padding */}
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Heading */}
      <header className="mb-6">
        <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#087f8c]">Your account</p>
        <h1 className="mt-2 t-hero t-w-700 tracking-[-0.05em] text-[#111827]">Orders</h1>
        <p className="mt-2 t-body text-[#6b7280]">
          Track deliveries, review past purchases, and manage returns.
        </p>
      </header>

      {/* Filter tabs: scrolls sideways on small screens */}
      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-[#e5e7eb] pb-2">
        {tabs.map((item) => (
          <button
            key={item} // Unique key required for list items
            onClick={() => setTab(item)} // Clicking selects this tab and re-renders
            // Active tab is blue, others are gray with a hover color
            className={`min-h-12 shrink-0 rounded-none px-4 t-body t-w-700 transition ${
              tab === item
                ? "bg-[#087f8c] text-white"
                : "text-[#6b7280] hover:bg-[#eaf9fa] hover:text-[#087f8c]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Order cards: one per order in the filtered list */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <article
            key={order.id} // Order id is unique
            className="rounded-none border border-[#e5e7eb] bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] sm:p-5"
          >
            {/* Top row: order number + date on the left, status badge on the right */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="t-w-700 text-[#111827]">Order {order.id}</p>
                {/* "item" becomes "items" when there is more than one */}
                <p className="mt-1 t-caption text-[#6b7280]">
                  Placed {order.createdAt} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              {/* Badge color comes from statusStyles above */}
              <span className={`rounded-none px-3 py-1.5 t-caption t-w-700 ${statusStyles[order.status]}`}>
                {order.status}
              </span>
            </div>

            {/* Bottom row: thumbnails, total, and details link */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#f3f4f6] pt-4">
              {/* Overlapping product thumbnails */}
              <div className="flex -space-x-2">
                {order.items.map((item) => (
                  <Image
                    key={item.productId}
                    src={item.image}
                    alt=""
                    width={48}
                    height={48}
                    sizes="48px"
                    className="h-12 w-12 rounded-none border-2 border-white bg-[#f3f4f6] object-contain"
                  />
                ))}
              </div>

              {/* Total and link, pushed to the right */}
              <div className="ml-auto flex items-center gap-4">
                <span className="t-w-700 text-[#111827]">${order.total.toFixed(2)}</span> {/* 2 decimals */}
                {/* Opens orders/[orderId]/page.tsx for this order */}
                <Link
                  href={`/orders/${order.id}`}
                  className="min-h-12 rounded-none border border-[#bcecf0] bg-[#eaf9fa] px-4 py-3 t-body t-w-700 text-[#087f8c] hover:bg-[#e2f7f9]"
                >
                  View details
                </Link>
              </div>
            </div>

            {/* Seller of the first item, with a fallback name */}
            <p className="mt-3 t-caption text-[#6b7280]">
              Seller: {getSeller(order.items[0]?.sellerId)?.name ?? "General-Store partner"}
            </p>
          </article>
        ))}
      </div>

      {/* Empty state: only when the selected tab has no orders */}
      {filtered.length === 0 && (
        <div className="rounded-none border border-dashed border-[#cbd5e1] bg-white p-10 text-center">
          <h2 className="t-w-700 text-[#111827]">No orders here yet</h2>
          <Link
            href="/search"
            className="mt-4 inline-flex min-h-12 items-center rounded-none bg-[#087f8c] px-5 t-body t-w-700 text-white"
          >
            Start shopping
          </Link>
        </div>
      )}
    </div>
    <Discovery sections={["viewed", "trending"]} />
    </>
  );
}
