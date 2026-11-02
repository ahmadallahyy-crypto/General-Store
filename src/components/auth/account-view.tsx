"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";

const quickLinks = [
  { href: "/orders", title: "My orders", detail: "Track, review and re-order" },
  { href: "/wishlist", title: "Wishlist", detail: "Items you saved for later" },
  { href: "/cart", title: "Cart", detail: "Pick up where you left off" },
  { href: "/info/contact", title: "Help and support", detail: "Questions about an order?" },
];

export function AccountView() {
  const { user, isHydrated, signOut } = useAuth();

  if (!isHydrated) return <div className="mx-auto max-w-3xl px-4 py-20 text-center t-body text-[#6b7280]">Loading your account...</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="t-hero t-w-700 text-[#111827]">Sign in to see your account</h1>
        <p className="mt-2 t-body text-[#6b7280]">Your orders, saved items and details live here.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/login?next=/account" className="inline-flex min-h-12 items-center bg-[#087f8c] px-6 t-body t-w-700 text-white hover:bg-[#0b6e78]">Sign in</Link>
          <Link href="/register?next=/account" className="inline-flex min-h-12 items-center border border-[#e5e7eb] bg-white px-6 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6">
        <p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#087f8c]">Your account</p>
        <h1 className="mt-2 t-hero t-w-700 tracking-[-0.05em] text-[#111827]">Hello, {user.name.split(" ")[0]}</h1>
      </header>

      <section aria-label="Profile" className="mb-6 rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
        <h2 className="t-title-section t-w-700 text-[#111827]">Profile</h2>
        <dl className="mt-3 grid gap-3 t-body sm:grid-cols-3">
          <div className="min-w-0"><dt className="t-caption uppercase tracking-wide text-[#6b7280]">Name</dt><dd className="break-words text-[#111827]">{user.name}</dd></div>
          <div className="min-w-0"><dt className="t-caption uppercase tracking-wide text-[#6b7280]">Email</dt><dd className="break-words text-[#111827]">{user.email}</dd></div>
          <div className="min-w-0"><dt className="t-caption uppercase tracking-wide text-[#6b7280]">Phone</dt><dd className="text-[#111827]">{user.phone || "Not added yet"}</dd></div>
        </dl>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block h-full rounded-none border border-[#e5e7eb] bg-white p-5 transition hover:border-[#087f8c]">
              <span className="t-16 t-w-700 text-[#111827]">{item.title}</span>
              <span className="mt-1 block t-body text-[#6b7280]">{item.detail}</span>
            </Link>
          </li>
        ))}
      </ul>

      <button type="button" onClick={signOut} className="mt-8 min-h-11 border border-[#e5e7eb] bg-white px-5 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">Sign out</button>
    </div>
  );
}
