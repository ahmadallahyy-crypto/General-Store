"use client";

import Image from "@/components/ui/safe-image";
import { fullPhoto } from "@/lib/images";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type Props = {
  images: string[];
  title: string;
  badge?: string;
  wished: boolean;
  onToggleWish: () => void;
};

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Product photos: thumbnails, previous/next, and a full-screen zoom.
 * Zoom: click the photo. Arrow keys move between photos, Escape closes, focus returns to the photo.
 */
export function ProductGallery({ images, title, badge, wished, onToggleWish }: Props) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = images.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const opener = openerRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [zoom, go]);

  return (
    <section className="pd-card pd-gallery" aria-label="Product gallery">
      {count > 1 && (
        <div className="pd-thumbnails" role="group" aria-label="Choose product image">
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => setIndex(i)} className={index === i ? "is-selected" : ""} aria-label={`Show image ${i + 1} of ${count}`} aria-pressed={index === i}>
              <Image src={src} alt="" fill sizes="72px" />
            </button>
          ))}
        </div>
      )}

      <div className="pd-main-image">
        <button ref={openerRef} type="button" className="pd-zoom-open" aria-label={`Enlarge photo of ${title}`} onClick={() => setZoom(true)}>
          <Image src={fullPhoto(images[index])} alt={`${title}, image ${index + 1} of ${count}`} fill preload sizes="(max-width: 760px) 100vw, 45vw" />
        </button>
        {badge && <span className="pd-tag">{badge}</span>}
        <button type="button" className="pd-wish" aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished} onClick={onToggleWish}>
          {wished ? "♥" : "♡"}
        </button>
        {count > 1 && (
          <>
            <button type="button" className="pd-nav pd-prev" aria-label="Previous image" onClick={() => go(-1)}>‹</button>
            <button type="button" className="pd-nav pd-next" aria-label="Next image" onClick={() => go(1)}>›</button>
            <span className="pd-counter" aria-hidden="true">{index + 1} / {count}</span>
          </>
        )}
      </div>

      {zoom && mounted &&
        createPortal(
          <div className="pd-lightbox" role="dialog" aria-modal="true" aria-label={`${title}, enlarged photos`}>
            <button type="button" className="pd-lb-backdrop" tabIndex={-1} aria-label="Close enlarged photo" onClick={() => setZoom(false)} />
            <div className="pd-lb-frame">
              <Image src={fullPhoto(images[index])} alt={`${title}, image ${index + 1} of ${count}`} fill sizes="100vw" />
            </div>
            <button ref={closeRef} type="button" className="pd-lb-btn pd-lb-close" aria-label="Close enlarged photo" onClick={() => setZoom(false)}>×</button>
            {count > 1 && (
              <>
                <button type="button" className="pd-lb-btn pd-lb-prev" aria-label="Previous image" onClick={() => go(-1)}>‹</button>
                <button type="button" className="pd-lb-btn pd-lb-next" aria-label="Next image" onClick={() => go(1)}>›</button>
                <span className="pd-lb-count" aria-live="polite">{index + 1} / {count}</span>
              </>
            )}
          </div>,
          document.body
        )}
    </section>
  );
}
