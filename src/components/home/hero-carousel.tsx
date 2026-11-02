"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/data/products";

const slides = [
  { title: "Find your next everyday favorite", copy: "Fresh picks from independent sellers, all in one place.", product: products[0], href: "/search" },
  { title: "Deals worth opening", copy: "Browse limited-time prices across fashion, home, and more.", product: products[10], href: "/search?sale=true" },
  { title: "Shop small. Live well.", copy: "Discover practical pieces from trusted marketplace sellers.", product: products[2], href: "/sellers" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  const slide = slides[index];
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-6 lg:px-8">
      <div className="relative min-h-[300px] overflow-hidden rounded-none bg-[#111827] sm:min-h-[360px] lg:min-h-[420px]">
        <Image src={slide.product.image} alt="" fill preload sizes="(min-width: 1024px) 1400px, 100vw" className="object-cover opacity-55 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,24,39,.96),rgba(17,24,39,.45),rgba(17,24,39,.08))]" />
        <div className="relative z-10 flex min-h-[300px] max-w-xl flex-col justify-center px-6 py-10 sm:min-h-[360px] sm:px-10 lg:min-h-[420px] lg:px-14"><p className="t-caption t-w-700 uppercase tracking-[0.18em] text-[#bcecf0]">General-Store marketplace</p><h1 className="mt-3 t-hero t-w-700 tracking-[-0.06em] text-white sm:t-hero lg:t-hero">{slide.title}</h1><p className="mt-4 max-w-md t-16 leading-7 text-[#e5e7eb]">{slide.copy}</p><Link href={slide.href} className="mt-7 inline-flex min-h-12 w-fit items-center rounded-none bg-[#f59e0b] px-6 t-body t-w-700 text-[#111827] transition hover:bg-[#fbbf24]">Shop now</Link></div>
        <div className="absolute bottom-5 right-6 z-10 flex gap-2">{slides.map((item, dotIndex) => <button key={item.title} type="button" aria-label={`Show slide ${dotIndex + 1}`} onClick={() => setIndex(dotIndex)} className={`h-2.5 rounded-none transition-all ${index === dotIndex ? "w-8 bg-[#f59e0b]" : "w-2.5 bg-white/60"}`} />)}</div>
      </div>
    </section>
  );
}
