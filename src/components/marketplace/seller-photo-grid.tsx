import Image from "@/components/ui/safe-image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Seller } from "@/lib/types";
import "./seller-photo-grid.css";

export function SellerPhotoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`seller-photo-grid ${className}`}>{children}</div>;
}

export function SellerPhotoCard({
  seller,
  href = `/seller/${seller.id}`,
  image,
  bannerTitle,
  bannerSubtitle,
  badge,
  verified,
  details,
  footer,
  bannerAspect = "square",
  imageFit = "contain",
}: {
  seller: Seller;
  href?: string;
  image: string;
  bannerTitle: string;
  bannerSubtitle?: string;
  badge?: ReactNode;
  verified?: boolean;
  details: ReactNode;
  footer?: ReactNode;
  bannerAspect?: "square" | "wide";
  imageFit?: "contain" | "cover";
}) {
  return (
    <article className="seller-photo-card">
      <Link href={href} className="seller-photo-card__main">
        <div className={`seller-photo-card__banner${bannerAspect === "wide" ? " seller-photo-card__banner--wide" : ""}`}>
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width:640px) 50vw, (max-width:1023px) 33vw, 17vw"
            className={imageFit === "cover" ? "object-cover" : "object-contain"}
          />
          <span className="seller-photo-card__shade" aria-hidden="true" />
          <span className="seller-photo-card__banner-copy">
            <strong>{bannerTitle}</strong>
            {bannerSubtitle && <small>{bannerSubtitle}</small>}
          </span>
          {badge && <span className="seller-photo-card__badge">{badge}</span>}
        </div>
        <div className="seller-photo-card__identity">
          <span className="seller-photo-card__avatar" aria-hidden="true">{seller.name.charAt(0)}</span>
          <span className="seller-photo-card__meta">
            <strong>
              {seller.name}
              {(verified ?? seller.verified) && (
                <svg className="seller-photo-card__verified" width="16" height="16" viewBox="0 0 24 24" aria-label="Verified" role="img">
                  <circle cx="12" cy="12" r="11" fill="#087f8c" />
                  <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </strong>
            {details}
          </span>
          <span className="seller-photo-card__arrow" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
      {footer && <div className="seller-photo-card__footer">{footer}</div>}
    </article>
  );
}
