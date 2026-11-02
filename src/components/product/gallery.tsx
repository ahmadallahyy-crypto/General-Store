"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] || images[0];

  if (!current) return null;

  return (
    <div className="relative h-full w-full">
      {/* Main image - constrained, object-contain, no overflow */}
      <div className="relative aspect-square h-full max-h-[680px] w-full overflow-hidden rounded-none border border-[#e5e7eb] bg-[#f8fafc] shadow-[0_16px_30px_rgba(15,23,42,0.04)]">
        <Image
          src={current.src}
          alt={current.altText}
          fill
          preload
          className="object-contain p-3 sm:p-5"
          sizes="(min-width: 1024px) 66vw, 100vw"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <div className="absolute bottom-[10%] left-1/2 z-10 flex -translate-x-1/2 items-center rounded-none border border-[#e5e7eb] bg-white/90 shadow-sm backdrop-blur-sm">
            <button
              onClick={() =>
                setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              className="px-4 py-2 text-[#4b5563] hover:text-[#111827]"
              aria-label="Previous image"
            >
              ←
            </button>
            <span className="text-[#d1d5db]">|</span>
            <button
              onClick={() =>
                setIndex((i) => (i === images.length - 1 ? 0 : i + 1))
              }
              className="px-4 py-2 text-[#4b5563] hover:text-[#111827]"
              aria-label="Next image"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <ul className="my-4 flex items-center justify-center gap-2 overflow-x-auto py-1 lg:mb-0">
          {images.map((image, i) => (
            <li key={`${image.src}-${i}`} className="h-20 w-20 flex-none">
              <button
                onClick={() => setIndex(i)}
                className={`relative h-full w-full overflow-hidden rounded-none border bg-[#f8fafc] ${
                  i === index
                    ? "border-2 border-[#087f8c]"
                    : "border-[#e5e7eb]"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.altText}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
