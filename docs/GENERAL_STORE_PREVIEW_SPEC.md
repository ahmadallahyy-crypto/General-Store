# General-Store preview: page and image specification

## Authority and scope

The sole visual reference for this specification is the local [compiled preview](../General-Store%20preview%20(real%20compiled%20CSS).html). Do not substitute an outside storefront, website, or design convention for a layout that is visible there. The preview's dark jump bar is a testing aid, not part of the storefront.

The preview is an interactive route sampler rather than a static screenshot. Use its jump links to inspect each route, and judge image fit in the image box (not from the source photo alone). Its fixture data may use different product names and counts from this app; preserve this app's actual data and interactions while matching the reference's section order, proportions, and image treatment.

The app also has a compact desktop density override: above 1100px, rem-based type and spacing use a 15px root size; above 1800px, primary page content and the footer are capped at 1800px. Mobile typography and 44px touch targets remain unchanged.

## Shared shell and product-card rules

- Keep the shared brand/search/actions header and category strip in the same order on every route. The category strip appears on the home route; other routes use the shared compact header.
- Keep the preview's type scale consistent across screen sizes: body text 16px, captions and product names 14px, product-page and section titles 20px, and 24px section-block titles. Campaign/hero titles are 32px on desktop and 24px on phones. Use the preview's 1.4 body line-height rather than shrinking detail text.
- Match the preview's page-content gutters: 72px left and 48px right above 1100px, 48px on both sides from 641px to 1100px, and 14px at 640px and below. Keep nested content wrappers from accumulating extra gutters.
- Product-card action backplates are 40px square with 44px interactive targets. On very narrow screens (374px and below), keep the primary account, wishlist, orders, and cart actions in the header; omit the redundant notification shortcut so the row fits without horizontal page scrolling.
- At wide desktop sizes, browse routes keep the 250px cart summary alongside the page; the home page uses a narrower 200px panel to preserve more room for its six-column product rows. Cart and checkout use their own summaries instead. The compact cart tab remains available where the reference shows it.
- Store imagery fills the box only where the preview uses `cover`; do not apply one fit rule globally. Product cards and campaign/shop covers crop with `cover`, gallery and order/cart line items preserve the whole product with `contain`, and official-store collection tiles use the fit shown in their section.
- The reusable catalog card has a square `cover` image. Wishlist control sits at the top right; quick-add sits at the top left; flash cards place the remaining-stock label at the image bottom. The title follows the image and is limited to two lines, then the current price and optional original price share a row, followed by stars and review count. Only flash cards add the sold-stock progress bar.
- Product grids and horizontal rails show six cards at widths above 1100px, four from 901–1100px, three from 641–900px, and two at 640px and below. Horizontal product rails remain horizontally scrollable rather than wrapping into rows.
- Card actions remain attached to the corresponding product: the image/title open its product route, the heart toggles the wishlist, and quick-add adds the default variant or opens the product's size selection when a size is required.
- Use horizontal rails for compact merchandising shelves and responsive grids for browse/result collections. Keep the card anatomy the same across both.

## Route-by-route visual order

### Home `/`

1. The first content block is a three-part hero: category links on the left, a wide rotating campaign in the center, and three short promotional links on the right. The center campaign image occupies the right side of the slide with a left-to-right text-protection gradient; the mobile slide uses the image as a muted background.
2. A row of eight quick actions follows, in this order: Official stores, Deals, Wishlist, Cart, Sellers, Track order, Checkout, and All products. It uses small icons and labels rather than product photos, in eight columns above 900px and four columns at 900px and below.
3. Flash sales use a colored section heading with the live countdown and a horizontal rail of shared product cards. The flash-card stock label and sold-progress bar are present.
4. Recent-search chips and their matching product rail appear only when there is recent-search data.
5. Category merchandising repeats as a category-colored strip followed by a product rail.
6. Top sellers use a three-column card grid. Each image is a wide landscape cover with a dark text overlay; seller identity, rating/followers, and product count sit below it.
7. Interest/category chips precede the recommended catalog grid. The grid's cards are the same shared product cards; “See more” extends the visible slice by 12.
8. Delivery, returns, payment, and support assurances close the feed.

Home behavior that affects this layout: the campaign advances every five seconds unless paused or reduced motion is requested; the countdown ends at local midnight; category chips filter the existing product list; recent products are ranked by the same search routine as search results; category promos only render when they have enough products; top sellers are ranked by followers.

### Seller directory `/sellers`

The directory orders its title/intro, category and rating filters, result count, then seller cards. Cards are compact: a 56-by-56 `cover` photo sits at the left of the seller name/category/verified line; rating and followers form the next row; response rate and product count form the next; a full-width “Visit shop” action finishes the card. Do not replace this layout with large square photo banners.

Responsive reference: one column on narrow phones, two columns at the preview's 898px viewport, three at larger desktop widths, and four at the widest desktop width. Category and minimum-rating filters operate on the current seller list; result count follows the filtered list.

### Local shops `/shops` and supermarket's local-shop section

The full page starts with breadcrumb and local-shop heading/description, then location controls and shop-type filters before the shop cards. The supermarket route places its supermarket-specific local-shop section before the category storefront.

Shop cards use a wide 2.15:1 photo cover with shop type and area/city over the image. Seller name, rating/product count, current opening status, delivery/pickup tags, and directions/shop links sit below. At 898px the preview uses two columns with images about 385-by-179; at 1440px it uses three columns with images about 321-by-150; at 390px it uses one column with images about 300-by-140.

Location permission is opt-in. A chosen city or permitted browser location reorders shops; radius/type filters and the open/closed, delivery, pickup, and direction details stay attached to each shop.

### Category `/search/[collection]`

For the sampled fashion and supermarket routes, the order is:

1. Breadcrumb/category summary.
2. Category campaign banner with a wide cover image behind the text/overlay.
3. “Shop by sub-category” image tiles. At the sampled desktop width, tiles are 4:3 covers.
4. Top-deals rail.
5. New-arrivals rail.
6. Best-sellers rail.
7. Top-brands image tiles.
8. All-products heading/sort controls and responsive shared-card grid.
9. Search/discovery shelves where data exists.

The supermarket route first shows the local-supermarket card section described above.

### Official stores `/search/official-store`

Start with an authenticity hero using a wide background cover, then official-store cards, collection tiles, brand tiles, top-deal rail, and seller-specific storefront blocks. Each seller block places its store heading/action before the deal shelf and full product grid. Finish with the official-store category links and discovery shelves. Keep each tile's fit local to its section; do not convert the square collection/store imagery into a 4:3 product crop.

### Seller storefront `/seller/[sellerId]`

Use a wide cover-image hero with its promotional copy/actions overlaid, then a “Top deals” horizontal card rail, then the all-products heading/grid, then viewed/trending discovery. Product-card image areas remain square and use the shared card anatomy.

### Search `/search`

Place the result summary and filters before the product grid. Product results use the shared square `cover` cards. Recently searched, recently viewed, and trending shelves follow the results when they have data. A misspelling may offer a “did you mean” recovery rather than changing the query silently.

### Product `/product/[handle]`

Start with breadcrumb, then a two-column product decision area at desktop: a gallery on the left and product information/purchase options on the right. The gallery has square `contain` main media and a vertical strip of square selectable thumbnails. The right column orders title/rating/price/stock/variants/perks before delivery, quantity, totals, and purchase actions. Product details, return policy, specifications, reviews, related products, and recent/trending shelves follow below. Related/recommendation shelves reuse square `cover` cards.

### Cart `/cart`

With items, show product line items with 96-by-96 square `contain` thumbnails beside variant, seller, quantity controls, line total, and remove action; keep the summary alongside at wide widths. When empty, show the empty-cart recovery action, then recommendation shelves.

### Checkout `/checkout`

Keep delivery/contact form and order summary as the primary two-column task when items exist. Order-summary line items use compact 44-by-44 square `contain` thumbnails. The preview's empty-cart state is text/action only, without invented product imagery.

### Orders `/orders` and `/orders/[orderId]`

Keep order status and summary ahead of the order lines. Product thumbnails in order rows are small 48-by-48 squares with `contain` fit. Do not promote these line-item photos into large banners.

### Wishlist `/wishlist`

With saved products, show the shared product-card grid, then “Move to cart” and “Remove” actions per card. The empty state is a clear message/action followed by recommendation shelves.

### Login, account, about, diagnostics, and 404

- Login and account are form/account surfaces with no product-photo hero.
- About is a text-first information page.
- Diagnostics is a diagnostic page (including its six image samples), not a merchandising section.
- 404 presents recovery links followed by a trending product shelf using the shared product cards.

## Implementation map

- Home section order and home-specific filtering/timers: `src/components/home/general-home.tsx` and `general-home.css`.
- Shared catalog-card image, price, rating, wishlist, quick-add, and stock/progress behavior: `src/components/home/product-card.tsx` and `product-card.css`.
- Shared result/discovery grids: `src/components/grid/product-feed.tsx` and `product-feed.css`.
- Seller directory cards: `src/components/marketplace/seller-card.tsx` and `src/app/sellers/page.tsx`.
- Official-store/shop photo cards: `src/components/marketplace/seller-photo-grid.tsx` and `seller-photo-grid.css`; local-shop aspect/grid overrides are in `src/components/shops/nearby-shops.css`.
- Product gallery: `src/components/product/product-gallery.tsx` and `product-detail.css`.

When a future visual edit is proposed, first identify the matching section in the local preview and record which image fit/aspect, card order, and responsive grid it shows. If a page/state is not represented in that preview, preserve its current behavior instead of guessing a new visual rule.
