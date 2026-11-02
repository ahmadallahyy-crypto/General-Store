# Jumia Public Homepage Redline Layout

This is a design redline based on the public homepage at https://www.jumia.com.ng and is intended as a reference for recreating the storefront shell and page rhythm without logging into the site.

## 1. Global Shell

### Header / Top Navigation
- Full-width top bar on a light gray background
- Left: brand mark + text logo
- Center: large search input with icon and dark blue search button
- Right: Account, Help, and Cart actions
- Rounded white container bar with subtle shadow
- Strong blue accent used for CTA and icon states
- Cart uses a small circular red badge for item count

### Category Strip
- Below the header, a category navigation bar with icon + label
- Horizontal scroll or carousel behavior
- Displayed as compact menu items in a neutral white bar
- Active or hovered category receives a light blue or soft filled state
- This is the major storefront navigation layer

### Page Background
- Light neutral page canvas
- White content cards with soft borders and slight shadows
- High padding between sections
- Large visual spacing to improve scanability

## 2. Homepage Structure

### Section A - Top Promo / Banner Row
- Horizontal campaign tiles or promo cards
- 6–8 short cards in a compact list
- Each tile has a distinct banner graphic and label
- Mostly image-driven, low text, high conversion style

### Section B - Utility Promo Row
- Compact horizontal mini-links with icons and labels
- Used for offers and quick category access
- Example categories: "Call for deals", "Earn While You Shop", "Up to 70% Off", etc.
- Carousel style with left/right navigation controls

### Section C - Flash Sales
- Large section title with countdown timer on the right
- Product cards displayed in a horizontal row or carousel
- Each product card includes:
  - image
  - stock tag
  - title
  - rating row
  - discounted price
  - old price
  - percent discount
- Card spacing is tight but readable
- Strong sale emphasis with orange/red price tags or discount labels

### Section D - Category Feature / Campaign Blocks
- Large promotional cards or branded category highlights
- One or more grids of image tiles representing major segments
- Used for major campaigns and seasonal offers

### Section E - Standard Product Grid Sections
- Additional merchandising blocks below fold
- Similar card structure as flash sales
- Section titles and compact product rows
- Good repetition in card pattern for catalog browsing

## 3. Product Card Layout

### Card Anatomy
- Square or near-square media block at the top
- Product image with soft crop and neutral background
- Under image: short product title
- Rating row under title with star icon and score
- Price block with current price on the first line
- Old price and discount percentage underneath
- Stock indicator text may appear near the image or top-left

### Card Styling
- White cards on a neutral page
- Tight internal spacing
- Light gray borders with subtle radius
- Blue used as action accent and search focus, but sale prices remain bold and attention-grabbing

## 4. Search Page Pattern

### Structure
- Header remains same as global shell
- Search results page has:
  - top summary or sort bar
  - optional filter sidebar on the left
  - results grid on the right
- Product cards maintain the same card system used on the homepage
- Filters are usually vertical pills, categories, and numeric ranges

### Visual System
- Sidebar: neutral background with light borders
- Filter chips: rounded pills, close spacing, selected state in blue
- Main area: dense product list with structured grid
- Full page is still highly scan-friendly and conversion-oriented

## 5. Collection / Category Page Pattern

### Structure
- Same header and category row
- Category hero banner or image banner at the top
- Collection title and optional intro text
- Product grid below with filters or sorting controls near top
- Often includes a subcategory highlight section or promotional strip

### Visual Style
- Slightly more curated than the homepage
- Product cards are still the same reusable block system
- Blue accent shows active category, filters, and navigation states

## 6. Product Detail Page Pattern

### Structure
- Left column: large product gallery with thumbnail selection
- Right column: product title, price, rating, variants, and CTA buttons
- Below main area: shipping or stock info, description, and related products
- Related products section usually uses the same horizontal grid pattern as flash sales

### Key UI Blocks
- image gallery with thumbnails
- color/size swatch selectors
- buy now / add to cart buttons
- review and rating summary
- description and details section
- cross-sell product strip below

### Style Direction
- Clean, spacious, conversion-focused
- Strong price emphasis and action buttons
- Soft ivory or white panel surfaces
- Blue primary button with strong contrast against white or pale background

## 7. Checkout Page Pattern

### Structure
- Left side: delivery and checkout form
- Right side: summary card with subtotal, shipping, discount, and total
- Form fields are simple and aligned in clean rows
- Buttons and confirmation actions are blue or dark blue

### Visual Pattern
- White cards, thin borders, light gray background
- Minimal but clear hierarchy
- Product summary may include small thumbnails and basic totals

## 8. Visual System From Jumia

### Color Palette
- Primary Blue: #2563EB
- Dark Blue / Action: #1D4ED8 or #1F2937
- Light Blue Fill: #EDF4FF
- Neutral Gray: #F5F5F5
- White: #FFFFFF
- Text Primary: #111827
- Text Muted: #6B7280
- Border: #E5E7EB or #EFEFEF
- Sale / Alert Red: #FF4D4F or similar warm red

### Shape Language
- Rounded corners on cards and input fields
- Slight shadows on floating white surfaces
- Clean, compact buttons with rounded edges
- Highly geometric layout with strong rectangular grids

### Interaction Language
- Light blue on hover
- Dark blue buttons for primary actions
- Search field is visually prominent and central
- Cart/notification icons are small, simple, and compact

## 9. Key Implementation Notes for This Project

1. Use the Jumia shell structure as the model:
   - white rounded top bar
   - central search field
   - compact account/help/cart actions
   - blue accent system

2. Keep the category strip as the second navigation layer.

3. Reuse the product card structure across home, collection, and search pages.

4. Follow the Jumia homepage rhythm:
   - promo row
   - utility row
   - flash sales section
   - campaign blocks
   - standard merchandising grid

5. Preserve the layout hierarchy but adapt the app content model to the current project instead of directly copying Jumia product data.

## 10. Recommended Build Priority

1. Header + search shell
2. Category navigation row
3. Promo and campaign blocks
4. Flash-sale product section
5. Product card reuse system
6. Collection/search filter layout
7. Product detail page structure
8. Checkout summary form layout

This gives a clean Jumia-inspired storefront system while staying consistent with the app’s current product structure.
