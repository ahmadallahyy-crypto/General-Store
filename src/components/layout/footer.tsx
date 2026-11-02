import { BrandLogo } from "@/components/layout/brand-logo";
import Link from "next/link";

type FooterItem = { label: string; href?: string };

const footerColumns: { title: string; items: FooterItem[] }[] = [
  {
    title: "About",
    items: [
      { label: "All products", href: "/search" },
      { label: "Seller directory", href: "/sellers" },
      { label: "About us", href: "/info/about" },
      { label: "Contact us", href: "/info/contact" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Track orders", href: "/orders" },
      { label: "My account", href: "/account" },
      { label: "Shops near you", href: "/shops" },
      { label: "Checkout", href: "/checkout" },
      { label: "Shipping & delivery", href: "/info/shipping" },
      { label: "Returns & refunds", href: "/info/returns" },
    ],
  },
  {
    title: "Categories",
    items: [
      { label: "Fashion", href: "/search/fashion" },
      { label: "Electronics", href: "/search/electronics" },
      { label: "Home & Living", href: "/search/home-office" },
      { label: "Health & Beauty", href: "/search/health-beauty" },
    ],
  },
];

const socialNetworks = ["X", "Facebook", "Instagram", "YouTube", "Pinterest", "LinkedIn"] as const;

function SocialIcon({ name }: { name: (typeof socialNetworks)[number] }) {
  const common = {
    "aria-hidden": true as const,
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "X":
      return <svg {...common}><path d="m5 4 14 16M19 4 5 20" /></svg>;
    case "Facebook":
      return <svg {...common}><path d="M14.5 4H12a3 3 0 0 0-3 3v2H7v3h2v8h3v-8h2.5l.5-3h-3V7a.8.8 0 0 1 .8-.8h1.7z" /></svg>;
    case "Instagram":
      return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.7" cy="6.5" r=".7" fill="currentColor" stroke="none" /></svg>;
    case "YouTube":
      return <svg {...common}><path d="M21 8.2a2.6 2.6 0 0 0-1.8-1.9C17.6 5.8 12 5.8 12 5.8s-5.6 0-7.2.5A2.6 2.6 0 0 0 3 8.2a27 27 0 0 0-.4 3.8 27 27 0 0 0 .4 3.8 2.6 2.6 0 0 0 1.8 1.9c1.6.5 7.2.5 7.2.5s5.6 0 7.2-.5a2.6 2.6 0 0 0 1.8-1.9 27 27 0 0 0 .4-3.8 27 27 0 0 0-.4-3.8Z" /><path d="m10 9 5 3-5 3z" /></svg>;
    case "Pinterest":
      return <svg {...common}><path d="M12 21a9 9 0 1 0-3.4-.7l1.5-5.2s.6 1.2 2.2 1.2c2.9 0 5-2.7 5-6.3 0-3.4-2.8-5.8-6.5-5.8-4.5 0-6.9 3-6.9 6.2 0 1.5.6 3 1.8 3.5.2.1.4 0 .5-.2l.3-1.1c.1-.3.1-.4-.2-.7-.4-.5-.7-1.1-.7-2 0-2.5 1.9-4.7 5-4.7 2.7 0 4.2 1.6 4.2 3.9 0 2.9-1.3 5.3-3.2 5.3-1.1 0-1.9-.9-1.6-2l.7-2.8c.4-1.7.1-3.1-1.3-3.1-1.1 0-2 1.2-2 2.8 0 1 .3 1.7.3 1.7l-1.2 5c-.4 1.5-.1 3.4 0 3.6" /></svg>;
    case "LinkedIn":
      return <svg {...common}><path d="M5 9v10M5 5.5v.1M10 19v-5.5a3 3 0 0 1 6 0V19M10 10v9" /></svg>;
  }
}

function FooterItemLink({ item }: { item: FooterItem }) {
  const className = "t-16 leading-7 text-white transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  if (!item.href) {
    return <span className={className}>{item.label}</span>;
  }

  return <Link className={className} href={item.href}>{item.label}</Link>;
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="mt-0 bg-[#087f8c] text-white">
      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-2 gap-x-8 gap-y-10 px-6 pb-12 pt-12 sm:px-10 md:gap-x-12 md:gap-y-12 lg:pl-[4.5rem] lg:pr-12 xl:grid-cols-[2.2fr_.95fr_1.05fr_.95fr] xl:gap-x-16 xl:pb-0 xl:pt-20">
        <section className="col-span-2 xl:col-span-1">
          <Link href="/" aria-label="General-Store home" className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <BrandLogo tone="onBlue" size="footer" />
          </Link>

          <p className="mt-5 max-w-[34rem] t-16 leading-[1.8] text-white sm:t-20">
            A marketplace for useful things, independent sellers, and better everyday shopping.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:gap-5" aria-label="Social media">
            {socialNetworks.map((name) => (
              <span key={name} role="img" aria-label={name} title={name} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 text-white sm:h-[60px] sm:w-[60px]">
                <SocialIcon name={name} />
              </span>
            ))}
          </div>
        </section>

        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="t-16 t-w-700 uppercase tracking-[0.16em] text-white sm:t-16">{column.title}</h2>
            <div className="mt-5 h-[7px] w-[58px] rounded-full bg-white" />
            <ul className="mt-6 space-y-3">
              {column.items.map((item) => (
                <li key={item.label}><FooterItemLink item={item} /></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-10 w-[calc(100%-3rem)] max-w-[2000px] border-t border-white/30 lg:mt-12" />

      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5 px-6 pb-10 pt-7 t-body text-white sm:px-10 md:flex-row md:items-center md:justify-between lg:pl-[4.5rem] lg:pr-12 lg:pb-16 lg:pt-8">
        <p>&copy; {currentYear} General-Store. All rights reserved.</p>
        <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href="/info/privacy" className="hover:underline">Privacy Policy</Link>
          <span aria-hidden="true" className="hidden h-6 border-l border-white/40 sm:block" />
          <Link href="/info/terms" className="hover:underline">Terms of Service</Link>
          <span aria-hidden="true" className="hidden h-6 border-l border-white/40 sm:block" />
          <Link href="/info/privacy" className="hover:underline">Cookies and local storage</Link>
        </nav>
      </div>
    </footer>
  );
}
