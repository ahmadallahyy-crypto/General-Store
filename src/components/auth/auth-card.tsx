import type { ReactNode } from "react";

// Shared frame for the sign-in and create-account screens.
export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-none border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_18px_rgba(15,23,42,0.04)] sm:p-8">
        <h1 className="t-title-page t-w-700 text-[#111827]">{title}</h1>
        <p className="mt-1 t-body text-[#6b7280]">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-5 text-center t-body text-[#6b7280]">{footer}</p>
    </div>
  );
}
