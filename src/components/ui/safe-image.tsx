"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// A drop-in replacement for next/image.
// If a photo cannot be loaded (removed, blocked by an extension, offline) it shows a neat coloured box with the
// product name, at the same size, instead of a broken-image icon, so the page layout never changes.
const hueOf = (text: string) => Math.abs([...text].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) % 360;

export default function SafeImage({ alt, onError, className, ...props }: ImageProps) {
  // Remember WHICH address failed, so a new src gets a fresh try automatically.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const key = typeof props.src === "string" ? props.src : "static";

  if (failedSrc === key) {
    const label = alt || "Photo unavailable";
    const hue = hueOf(label);
    const fill = "fill" in props && props.fill;
    return (
      <span
        role="img"
        aria-label={label}
        className={`safe-img-fallback ${className ?? ""}`}
        style={{ background: `hsl(${hue} 40% 88%)`, color: `hsl(${hue} 40% 22%)`, ...(fill ? { position: "absolute", inset: 0 } : { width: props.width, height: props.height }) }}
      >
        <span>{label}</span>
      </span>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      {...props}
      onError={(event) => {
        setFailedSrc(key);
        onError?.(event);
      }}
    />
  );
}
