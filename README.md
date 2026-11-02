# Generalstore

Generalstore is a marketplace-style storefront prototype built with Next.js App Router, React, and TypeScript. The app includes a product catalog, category and search browsing, product and seller pages, a browser-persisted cart and wishlist, and demo checkout and sample order pages.

## What works in this prototype

- Browse the home feed, categories, subcategories, and product search.
- Open product details and see sample seller, rating, delivery, and sale information.
- Add products to a cart, adjust quantities, and keep cart state in this browser's local storage.
- Save products to a wishlist in this browser's local storage.
- Browse synthetic seller storefronts and sample order history.
- Submit the demo checkout form to see a local confirmation; it clears the cart.

Catalog, seller, marketplace, and order data are TypeScript fixtures. Checkout does not collect payment or create a persisted order. There is no backend, database, authentication, or payment provider integration in this repository.

## Requirements and local development

Install a supported Node.js version and npm, then run:

```bash
npm install
npm run dev
```

The development server listens on [http://localhost:3001](http://localhost:3001).

Other scripts defined in `package.json` are `npm run build`, `npm start` (serves the production build on port 3001), and `npm run lint`. There is no test script defined in `package.json`.

## Routes

| Route | Purpose |
|---|---|
| `/` | Marketplace home feed |
| `/search` | Product search and filtered results |
| `/search/[collection]` | Category landing page; `official-store` has its own landing page |
| `/search/[collection]/[subcategory]` | Subcategory product listing |
| `/product/[handle]` | Product detail and related products |
| `/sellers` | Seller directory |
| `/seller/[sellerId]` | Seller storefront |
| `/cart` | Full cart page |
| `/wishlist` | Saved products |
| `/checkout` | Demo checkout form |
| `/orders` | Sample order list |
| `/orders/[orderId]` | Sample order details |

## Source map

- `src/app/` contains App Router pages, the root layout, and global CSS.
- `src/components/home/` contains the active home feed (`GeneralHome`) and reusable/earlier homepage sections.
- `src/components/layout/` contains the navbar, footer, search navigation, and sorting controls.
- `src/components/marketplace/`, `category/`, `grid/`, and `product/` contain reusable marketplace, category, product-card, and product-detail UI.
- `src/components/cart/` and `src/components/wishlist/` contain client state providers and cart UI.
- `src/data/products.ts` defines the product catalog, category groups, and catalog filtering helpers.
- `src/lib/mock/marketplace.ts` enriches catalog products with synthetic seller and marketplace details and defines sample orders.
- `src/lib/types.ts` defines shared seller, marketplace product, and order types.
- `src/lib/use-persistent-state.ts` reads/writes browser local storage for cart and wishlist state.
- `src/data/tile-images.ts` maps category and brand tiles to image URLs.
- [`docs/GENERAL_STORE_PREVIEW_SPEC.md`](docs/GENERAL_STORE_PREVIEW_SPEC.md) records the local compiled preview's page order, image treatment, and shared card behavior.

`src/app/page.tsx` currently renders `GeneralHome`; several standalone home components remain available but are not the active home page composition.

For a code review and diagrams of the current data and page flows, see [`docs/REVIEW.md`](docs/REVIEW.md) and [`docs/DIAGRAMS.md`](docs/DIAGRAMS.md). [`PRODUCT.md`](PRODUCT.md) and [`REDLINE_LAYOUTS.md`](REDLINE_LAYOUTS.md) describe product/design direction and should be read as guidance, not proof that every proposed layout or interaction is implemented.
