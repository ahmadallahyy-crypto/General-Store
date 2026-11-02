# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing Next.js, TypeScript, and Tailwind CSS application. The current repository and its redline layout document are the implementation source of truth.

## Users

Inferred from the current brief: everyday online shoppers browsing a multi-category catalog. They need to discover products quickly, compare options, inspect product details, add items to a cart, and complete a purchase flow.

## Product Purpose

Generalstore is an ecommerce storefront where shoppers discover and purchase products through a marketplace-style browsing experience. Success means a clear path from category discovery through product inspection, cart review, and demo checkout.

## Positioning

Inferred from the current redline request: a Generalstore-owned marketplace experience with the scan-friendly information architecture of large ecommerce platforms, while retaining its own name, catalog, imagery, and product flow. It should be marketplace-inspired rather than copy Jumia branding, content, or proprietary assets.

## Operating Context

The current project is developed locally as a Next.js web application. The Jumia Nigeria public website is a layout reference for marketplace rhythm, category navigation, promotion rails, flash-sale merchandising, and checkout structure. The implementation remains an original Generalstore storefront.

## Capabilities and Constraints

- Preserve the existing ecommerce purpose and product-purchase workflow.
- Use the existing product catalog and redline layout document as the source of truth for future implementation decisions.
- Match common marketplace information architecture closely where it improves discovery and conversion, without copying Jumia trademarks, brand identity, content, or proprietary assets.
- All product images used by the finished experience must come from the repository or its approved data sources; do not invent replacement imagery.
- Product images must fit their image cards correctly without distortion or unintended cropping.
- Account for image loading time and preserve a polished loading experience.
- Existing catalog, cart, and demo checkout behavior may be expanded when required for marketplace parity, but must not be broken.

## Brand Commitments

Preserve the Generalstore name, blue action accent, original product catalog, and repository-backed imagery. Keep the marketplace reference influence structural and make the shipped storefront visibly distinct from Jumia.

## Evidence on Hand

- Existing implementation in this repository, including product catalog, product pages, search/collection pages, cart, and checkout.
- Redline layout document: `REDLINE_LAYOUTS.md`.
- Public layout reference: https://www.jumia.com.ng/.
- No additional approved brand assets or image library have been supplied.

## Product Principles

- Favor clear marketplace discovery over speculative decoration.
- Keep the shopping path clear from discovery through purchase.
- Use real repository-backed product content and imagery.
- Make image presentation stable, responsive, and visually accurate.
- Preserve ecommerce functionality while improving the implementation incrementally.
- Keep Generalstore visibly distinct from any reference marketplace.

## Accessibility & Inclusion

No product-specific accessibility standard was established. Future work should preserve accessible web fundamentals, including keyboard navigation, visible focus states, readable contrast, meaningful labels, and responsive layouts.