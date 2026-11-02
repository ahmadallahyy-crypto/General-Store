// URL: /orders/ORD-123  ([orderId] matches any id). No "use client" = server component.

import Image from "@/components/ui/safe-image";
import Link from "next/link"; // Navigate between pages without a full reload
import { notFound } from "next/navigation";
import { Discovery } from "@/components/discovery/discovery"; // Function that shows the 404 page
import { getSeller, orders } from "@/lib/mock/marketplace"; // Fake data: orders array + seller lookup helper

// Delivery stages in order. Used to draw the progress bar.
const steps = ["Pending", "Packed", "Shipped", "Delivered"];

// Tells Next.js which order ids exist so it can pre-build a page for each at build time.
export function generateStaticParams() {
  return orders.map((order) => ({ orderId: order.id })); // e.g. [{ orderId: "ORD-123" }, ...]
}

// The page. params is a Promise in newer Next.js, so the function is async.
export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params; // Wait for params, then read the id from the URL

  const order = orders.find((item) => item.id === orderId); // Find the matching order (undefined if none)

  if (!order) notFound(); // No match: show the 404 page and stop here

  // Which progress step is the order on?
  // Cancelled stays at 0. Otherwise use the status position in "steps".
  // Math.max(0, ...) stops a -1 result if the status isn't in the list.
  const stepIndex = order.status === "Cancelled" ? 0 : Math.max(0, steps.indexOf(order.status));

  const seller = getSeller(order.items[0]?.sellerId); // Seller of the first item, used in the help box

  return (
    <>
    {/* Page wrapper: centered, max width, responsive padding */}
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Link back to the list page. &lt; is a safe "<" symbol in HTML. */}
      <Link href="/orders" className="t-body t-w-700 text-[#087f8c]">
        &lt;- Back to orders
      </Link>

      {/* ---------- Heading ---------- */}
      <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#6b7280]">Order details</p> {/* small label */}
          <h1 className="mt-2 t-hero t-w-700 tracking-[-0.04em] text-[#111827]">{order.id}</h1> {/* order id as title */}
          <p className="mt-1 t-body text-[#6b7280]">Placed {order.createdAt}</p> {/* date placed */}
        </div>
        {/* Status badge */}
        <span className="rounded-none bg-[#e2f7f9] px-3 py-1.5 t-caption t-w-700 text-[#0b6e78]">
          {order.status}
        </span>
      </header>

      {/* ---------- Delivery progress ---------- */}
      <section className="mt-6 rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
        <h2 className="t-w-700 text-[#111827]">Delivery progress</h2>

        {/* 4-column grid: one column per step */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            // relative lets the connecting line be positioned inside this box
            <div key={step} className="relative text-center">
              {/* Numbered circle: blue if the step is reached, gray if not */}
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-none t-body t-w-700 ${
                  index <= stepIndex ? "bg-[#087f8c] text-white" : "bg-[#e5e7eb] text-[#6b7280]"
                }`}
              >
                {index + 1} {/* index starts at 0, so add 1 to show 1-4 */}
              </div>

              <p className="mt-2 t-caption t-w-500 text-[#4b5563]">{step}</p> {/* step name */}

              {/* Line to the next circle. Skipped after the last step. */}
              {index < steps.length - 1 && (
                <span
                  // Blue only if the order has moved PAST this step
                  className={`absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-5 h-0.5 ${
                    index < stepIndex ? "bg-[#087f8c]" : "bg-[#e5e7eb]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Red message shown only for cancelled orders */}
        {order.status === "Cancelled" && (
          <p className="mt-5 rounded-none bg-[#fef2f2] p-3 t-body text-[#b91c1c]">
            This order was cancelled. No further delivery updates are expected.
          </p>
        )}
      </section>

      {/* ---------- Items + help box ---------- */}
      {/* Big screens: wide items column + 320px help column. Stacked on mobile. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: items in this order */}
        <section className="rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
          <h2 className="t-w-700 text-[#111827]">Items</h2>

          {/* List with thin dividing lines */}
          <ul className="mt-4 divide-y divide-[#f3f4f6]">
            {order.items.map((item) => (
              // One row per item
              <li key={item.productId} className="flex gap-3 py-4">
                <Image src={item.image} alt="" width={64} height={64} sizes="64px" className="h-16 w-16 rounded-none bg-[#f8fafc] object-contain" /> {/* picture */}

                {/* Title, quantity, seller. min-w-0 lets long titles shrink. */}
                <div className="min-w-0 flex-1">
                  <p className="t-w-500 text-[#111827]">{item.title}</p>
                  <p className="mt-1 t-caption text-[#6b7280]">
                    Qty {item.quantity} · {getSeller(item.sellerId)?.name}
                  </p>
                </div>

                {/* Line total = price x quantity, 2 decimal places */}
                <span className="t-w-700 text-[#111827]">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Right: help box */}
        <aside className="rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
          <h2 className="t-w-700 text-[#111827]">Need help?</h2>

          {/* Seller name, with a fallback if not found */}
          <p className="mt-2 t-body text-[#6b7280]">{seller?.name ?? "Your seller"} is handling this order.</p>

          {/* Does nothing yet: no onClick */}
          <button
            type="button"
            disabled
            title="Order tracking is coming soon"
            className="mt-5 min-h-12 w-full rounded-none bg-[#087f8c] px-4 t-body t-w-700 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Track order
          </button>

          {/* Also does nothing yet */}
          <button
            type="button"
            disabled
            title="Returns are coming soon"
            className="mt-3 min-h-12 w-full rounded-none border border-[#e5e7eb] px-4 t-body t-w-700 text-[#374151] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Return item
          </button>
          <p className="mt-3 t-caption text-[#6b7280]">Tracking and returns are coming soon.</p>
        </aside>
      </div>
    </div>
    <Discovery sections={["viewed", "trending"]} />
    </>
  );
}
