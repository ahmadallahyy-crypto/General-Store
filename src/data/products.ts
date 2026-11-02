import { productCopy } from "./product-copy";
import { searchProducts } from "@/lib/search";

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  highlights?: string[];
  price: number;
  currency: string;
  image: string;
  images: string[];
  category: string;
  subcategory?: string;
  collections?: string[];
  featured?: boolean;
};

export type CategorySubcategory = {
  title: string;
  slug: string;
  description?: string;
  image?: string;
};

// A labeled group of subcategory links (e.g. "Mobile Phones" -> Smartphones, Android Phones).
// Mirrors how Jumia groups links under a bold heading inside the hover mega-menu.
export type CategorySubGroup = {
  title: string;
  links: CategorySubcategory[];
};

export type CategoryGroup = {
  title: string;
  slug: string;
  icon: string;
  categories: string[];
  subCategories: CategorySubcategory[];
  // Optional grouped flyout columns. When present the navbar renders these
  // labeled columns; `subCategories` remains the flat routing source of truth.
  subGroups?: CategorySubGroup[];
};

export const categoryGroups: CategoryGroup[] = [
  { title: "Official Store", slug: "official-store", icon: "M6 8h12v11H6zM8 8V6a4 4 0 0 1 8 0v2M9 12h6", categories: [], subCategories: [{ title: "Top deals", slug: "top-deals" }, { title: "Trending brands", slug: "trending-brands" }, { title: "Featured picks", slug: "featured-picks" }, { title: "New arrivals", slug: "new-arrivals" }, { title: "Best sellers", slug: "best-sellers" }, { title: "Clearance", slug: "clearance" }],
    subGroups: [
      { title: "Highlights", links: [{ title: "Top Deals", slug: "top-deals" }, { title: "Featured Picks", slug: "featured-picks" }, { title: "New Arrivals", slug: "new-arrivals" }, { title: "Best Sellers", slug: "best-sellers" }] },
      { title: "Collections", links: [{ title: "Trending Brands", slug: "trending-brands" }, { title: "Clearance", slug: "clearance" }, { title: "Editors' Choice", slug: "featured-picks" }] },
      { title: "Top Brands", links: [{ title: "General Store", slug: "trending-brands" }, { title: "Nexus", slug: "trending-brands" }, { title: "Hisense", slug: "trending-brands" }, { title: "TCL", slug: "trending-brands" }, { title: "Samsung", slug: "trending-brands" }, { title: "LG", slug: "trending-brands" }] },
    ] },
  { title: "Automobile", slug: "automobile", icon: "M5 17h14m-1 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M5 17H4V9l2-4h12l2 4v8h-1M5 17a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M4 9h16M7 13h.01M17 13h.01", categories: ["automobile"], subCategories: [] },
  { title: "Appliances", slug: "appliances", icon: "M6 7h12v12H6zM9 7V5h6v2M9 11h6", categories: ["appliances"], subCategories: [{ title: "Kitchen appliances", slug: "kitchen-appliances" }, { title: "Laundry", slug: "laundry" }, { title: "Cooling", slug: "cooling" }, { title: "Home care", slug: "home-care" }, { title: "Small appliances", slug: "small-appliances" }, { title: "Floor care", slug: "floor-care" }],
    subGroups: [
      { title: "Small Appliances", links: [{ title: "Blenders", slug: "small-appliances" }, { title: "Deep Fryers", slug: "small-appliances" }, { title: "Juicers", slug: "small-appliances" }, { title: "Air Fryers", slug: "small-appliances" }, { title: "Rice Cookers", slug: "kitchen-appliances" }, { title: "Toasters & Ovens", slug: "kitchen-appliances" }, { title: "Vacuums", slug: "floor-care" }] },
      { title: "Large Appliances", links: [{ title: "Washing Machines", slug: "laundry" }, { title: "Fridges", slug: "cooling" }, { title: "Freezers", slug: "cooling" }, { title: "Air Conditioners", slug: "cooling" }, { title: "Heaters", slug: "home-care" }, { title: "Fans", slug: "cooling" }] },
      { title: "Top Brands", links: [{ title: "Nexus", slug: "home-care" }, { title: "Hisense", slug: "cooling" }, { title: "Polystar", slug: "kitchen-appliances" }, { title: "TCL", slug: "cooling" }, { title: "LG", slug: "laundry" }, { title: "Samsung", slug: "cooling" }] },
    ] },
  { title: "Phones & Tablets", slug: "phones-tablets", icon: "M8 3h8v18H8zM11 18h2", categories: ["phones"], subCategories: [{ title: "Smartphones", slug: "smartphones" }, { title: "Tablets", slug: "tablets" }, { title: "Mobile accessories", slug: "mobile-accessories" }, { title: "Smart watches", slug: "smart-watches" }, { title: "Audio", slug: "audio" }, { title: "Wearables", slug: "wearables" }],
    subGroups: [
      { title: "Mobile Phones", links: [{ title: "Smartphones", slug: "smartphones" }, { title: "Android Phones", slug: "smartphones" }, { title: "iPhones", slug: "smartphones" }, { title: "Basic Phones", slug: "smartphones" }, { title: "Refurbished Phones", slug: "smartphones" }] },
      { title: "Mobile Accessories", links: [{ title: "Accessory Kits", slug: "mobile-accessories" }, { title: "Adapters", slug: "mobile-accessories" }, { title: "Batteries", slug: "mobile-accessories" }, { title: "Battery Chargers", slug: "mobile-accessories" }, { title: "Bluetooth Headsets", slug: "audio" }, { title: "Cables", slug: "mobile-accessories" }] },
      { title: "Tablets & Watches", links: [{ title: "Tablets", slug: "tablets" }, { title: "Smart Watches", slug: "smart-watches" }, { title: "Audio", slug: "audio" }, { title: "Wearables", slug: "wearables" }] },
      { title: "Top Brands", links: [{ title: "Apple", slug: "smartphones" }, { title: "Samsung", slug: "smartphones" }, { title: "Tecno", slug: "smartphones" }, { title: "Infinix", slug: "tablets" }, { title: "Xiaomi", slug: "tablets" }, { title: "Oppo", slug: "smartphones" }] },
    ] },
  { title: "Health & Beauty", slug: "health-beauty", icon: "M9 4h2v7H9zM13 7h2v7h-2zM8 11a3 3 0 1 0 0 6h3v-6zm8 2a3 3 0 1 1 0 6h-3v-6z", categories: ["beauty"], subCategories: [{ title: "Skincare", slug: "skincare" }, { title: "Hair care", slug: "hair-care" }, { title: "Personal care", slug: "personal-care" }, { title: "Wellness", slug: "wellness" }, { title: "Fragrance", slug: "fragrance" }, { title: "Makeup", slug: "makeup" }],
    subGroups: [
      { title: "Skincare", links: [{ title: "Face Care", slug: "skincare" }, { title: "Body Care", slug: "skincare" }, { title: "Moisturizers", slug: "skincare" }, { title: "Sunscreen", slug: "skincare" }, { title: "Serums", slug: "skincare" }] },
      { title: "Makeup", links: [{ title: "Face Makeup", slug: "makeup" }, { title: "Eye Makeup", slug: "makeup" }, { title: "Lip Color", slug: "makeup" }, { title: "Makeup Brushes", slug: "makeup" }] },
      { title: "Hair & Fragrance", links: [{ title: "Shampoos", slug: "hair-care" }, { title: "Conditioners", slug: "hair-care" }, { title: "Hair Styling", slug: "hair-care" }, { title: "Perfumes", slug: "fragrance" }, { title: "Body Sprays", slug: "fragrance" }] },
      { title: "Personal & Wellness", links: [{ title: "Oral Care", slug: "personal-care" }, { title: "Bath & Body", slug: "personal-care" }, { title: "Vitamins", slug: "wellness" }, { title: "Supplements", slug: "wellness" }] },
      { title: "Top Brands", links: [{ title: "Nivea", slug: "skincare" }, { title: "L'Oreal", slug: "hair-care" }, { title: "Dove", slug: "personal-care" }, { title: "Oral-B", slug: "personal-care" }, { title: "Garnier", slug: "skincare" }, { title: "Olay", slug: "skincare" }] },
    ] },
  { title: "Home & Office", slug: "home-office", icon: "M4 11 12 4l8 7v9H4zM9 20v-6h6v6", categories: ["bags", "drinkware", "jackets"], subCategories: [{ title: "Furniture", slug: "furniture" }, { title: "Decor", slug: "decor" }, { title: "Lighting", slug: "lighting" }, { title: "Kitchen", slug: "kitchen" }, { title: "Office", slug: "office" }, { title: "Storage", slug: "storage" }],
    subGroups: [
      { title: "Furniture", links: [{ title: "Sofas & Couches", slug: "furniture" }, { title: "Beds & Mattresses", slug: "furniture" }, { title: "Wardrobes", slug: "furniture" }, { title: "Tables & Chairs", slug: "furniture" }] },
      { title: "Home Decor & Lighting", links: [{ title: "Wall Art", slug: "decor" }, { title: "Curtains & Blinds", slug: "decor" }, { title: "Rugs & Carpets", slug: "decor" }, { title: "Ceiling Lights", slug: "lighting" }, { title: "Table Lamps", slug: "lighting" }] },
      { title: "Kitchen & Office", links: [{ title: "Cookware", slug: "kitchen" }, { title: "Dinnerware", slug: "kitchen" }, { title: "Office Desks", slug: "office" }, { title: "Office Chairs", slug: "office" }, { title: "Storage & Shelves", slug: "storage" }] },
      { title: "Top Brands", links: [{ title: "IKEA", slug: "furniture" }, { title: "Ashley", slug: "furniture" }, { title: "Philips", slug: "lighting" }, { title: "Tefal", slug: "kitchen" }, { title: "Pyrex", slug: "kitchen" }, { title: "Home Centre", slug: "decor" }] },
    ] },
  { title: "Electronics", slug: "electronics", icon: "M4 6h16v10H4zM9 20h6M12 16v4", categories: ["electronics"], subCategories: [{ title: "Audio", slug: "audio" }, { title: "Cameras", slug: "cameras" }, { title: "Gaming", slug: "gaming" }, { title: "Smart devices", slug: "smart-devices" }, { title: "Accessories", slug: "accessories" }, { title: "Printers", slug: "printers" }],
    subGroups: [
      { title: "Televisions & Video", links: [{ title: "Smart TVs", slug: "smart-devices" }, { title: "LED TVs", slug: "smart-devices" }, { title: "Streaming Devices", slug: "smart-devices" }, { title: "Projectors", slug: "smart-devices" }] },
      { title: "Audio & Cameras", links: [{ title: "Soundbars", slug: "audio" }, { title: "Home Theatre", slug: "audio" }, { title: "Bluetooth Speakers", slug: "audio" }, { title: "DSLR Cameras", slug: "cameras" }, { title: "Action Cameras", slug: "cameras" }] },
      { title: "Gaming & Accessories", links: [{ title: "PlayStation", slug: "gaming" }, { title: "Xbox", slug: "gaming" }, { title: "Cables & Chargers", slug: "accessories" }, { title: "Power Banks", slug: "accessories" }] },
      { title: "Office Technology", links: [{ title: "Printers", slug: "printers" }, { title: "Scanners", slug: "printers" }, { title: "Ink & Toner", slug: "printers" }] },
      { title: "Top Brands", links: [{ title: "Sony", slug: "audio" }, { title: "LG", slug: "smart-devices" }, { title: "Samsung", slug: "smart-devices" }, { title: "JBL", slug: "audio" }, { title: "Bose", slug: "audio" }, { title: "Canon", slug: "cameras" }] },
    ] },
  { title: "Fashion", slug: "fashion", icon: "M8 4l4 2 4-2 4 4-3 4-2-2v10H9V10l-2 2-3-4 4-4Z", categories: ["shirts", "hoodies", "footwear", "headwear", "jackets"], subCategories: [{ title: "T-shirts", slug: "t-shirts" }, { title: "Hoodies", slug: "hoodies" }, { title: "Footwear", slug: "footwear" }, { title: "Bags", slug: "bags" }, { title: "Headwear", slug: "headwear" }, { title: "Jackets", slug: "jackets" }],
    subGroups: [
      { title: "Men's Fashion", links: [{ title: "T-Shirts", slug: "t-shirts" }, { title: "Shirts", slug: "t-shirts" }, { title: "Hoodies & Sweatshirts", slug: "hoodies" }, { title: "Jackets & Coats", slug: "jackets" }, { title: "Jeans", slug: "t-shirts" }] },
      { title: "Women's Fashion", links: [{ title: "Dresses", slug: "t-shirts" }, { title: "Tops & Blouses", slug: "t-shirts" }, { title: "Hoodies", slug: "hoodies" }, { title: "Jackets", slug: "jackets" }] },
      { title: "Footwear & Accessories", links: [{ title: "Sneakers", slug: "footwear" }, { title: "Sandals & Slippers", slug: "footwear" }, { title: "Handbags", slug: "bags" }, { title: "Backpacks", slug: "bags" }, { title: "Caps & Hats", slug: "headwear" }] },
      { title: "Top Brands", links: [{ title: "Nike", slug: "footwear" }, { title: "Adidas", slug: "footwear" }, { title: "Zara", slug: "t-shirts" }, { title: "H&M", slug: "hoodies" }, { title: "Puma", slug: "footwear" }, { title: "Levi's", slug: "t-shirts" }] },
    ] },
  { title: "Supermarket", slug: "supermarket", icon: "M6 11c0-4 3-7 6-7s6 3 6 7c0 5-3 9-6 9s-6-4-6-9Zm6-7V2", categories: ["groceries"], subCategories: [{ title: "Groceries", slug: "groceries" }, { title: "Snacks", slug: "snacks" }, { title: "Drinks", slug: "drinks" }, { title: "Household", slug: "household" }, { title: "Bakery", slug: "bakery" }, { title: "Frozen foods", slug: "frozen-foods" }],
    subGroups: [
      { title: "Food Cupboard", links: [{ title: "Rice & Pasta", slug: "groceries" }, { title: "Cooking Oil", slug: "groceries" }, { title: "Canned Foods", slug: "groceries" }, { title: "Spices & Seasoning", slug: "groceries" }] },
      { title: "Snacks & Bakery", links: [{ title: "Biscuits & Cookies", slug: "snacks" }, { title: "Chips & Crisps", slug: "snacks" }, { title: "Bread", slug: "bakery" }, { title: "Cakes & Pastries", slug: "bakery" }] },
      { title: "Frozen & Chilled", links: [{ title: "Frozen foods", slug: "frozen-foods" }, { title: "Ice Cream", slug: "frozen-foods" }, { title: "Ready Meals", slug: "frozen-foods" }] },
      { title: "Drinks & Household", links: [{ title: "Soft Drinks", slug: "drinks" }, { title: "Juices", slug: "drinks" }, { title: "Water", slug: "drinks" }, { title: "Cleaning Supplies", slug: "household" }, { title: "Laundry", slug: "household" }] },
      { title: "Top Brands", links: [{ title: "Coca-Cola", slug: "drinks" }, { title: "Nestle", slug: "groceries" }, { title: "Indomie", slug: "groceries" }, { title: "Pepsi", slug: "drinks" }, { title: "Dangote", slug: "groceries" }, { title: "Golden Penny", slug: "bakery" }] },
    ] },
  { title: "Computing", slug: "computing", icon: "M4 5h16v11H4zM9 20h6M12 16v4", categories: ["electronics"], subCategories: [{ title: "Laptops", slug: "laptops" }, { title: "Desktops", slug: "desktops" }, { title: "Accessories", slug: "accessories" }, { title: "Storage", slug: "storage" }, { title: "Networking", slug: "networking" }, { title: "Monitors", slug: "monitors" }],
    subGroups: [
      { title: "Laptops", links: [{ title: "Gaming Laptops", slug: "laptops" }, { title: "Ultrabooks", slug: "laptops" }, { title: "2-in-1 Laptops", slug: "laptops" }, { title: "MacBooks", slug: "laptops" }] },
      { title: "Desktops & Monitors", links: [{ title: "All-in-One PCs", slug: "desktops" }, { title: "Gaming Desktops", slug: "desktops" }, { title: "Monitors", slug: "monitors" }] },
      { title: "Accessories & Storage", links: [{ title: "Keyboards & Mice", slug: "accessories" }, { title: "External Hard Drives", slug: "storage" }, { title: "SSDs", slug: "storage" }, { title: "USB Flash Drives", slug: "storage" }, { title: "Routers", slug: "networking" }] },
      { title: "Top Brands", links: [{ title: "HP", slug: "laptops" }, { title: "Dell", slug: "laptops" }, { title: "Lenovo", slug: "desktops" }, { title: "Apple", slug: "laptops" }, { title: "Asus", slug: "laptops" }, { title: "Acer", slug: "desktops" }] },
    ] },
  { title: "Baby Products", slug: "baby-products", icon: "M12 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-2 4h.01M14 10h.01M10 14c1.5 1 2.5 1 4 0", categories: ["kids"], subCategories: [{ title: "Feeding", slug: "feeding" }, { title: "Nursery", slug: "nursery" }, { title: "Travel", slug: "travel" }, { title: "Clothing", slug: "clothing" }, { title: "Safety", slug: "safety" }, { title: "Toys", slug: "toys" }],
    subGroups: [
      { title: "Feeding & Nursing", links: [{ title: "Baby Bottles", slug: "feeding" }, { title: "Breast Pumps", slug: "feeding" }, { title: "Baby Food", slug: "feeding" }, { title: "High Chairs", slug: "feeding" }] },
      { title: "Nursery & Safety", links: [{ title: "Cribs & Cots", slug: "nursery" }, { title: "Baby Monitors", slug: "safety" }, { title: "Car Seats", slug: "safety" }, { title: "Baby Gates", slug: "safety" }] },
      { title: "Clothing & Toys", links: [{ title: "Baby Clothes", slug: "clothing" }, { title: "Diapers", slug: "clothing" }, { title: "Educational Toys", slug: "toys" }, { title: "Soft Toys", slug: "toys" }, { title: "Strollers", slug: "travel" }] },
      { title: "Top Brands", links: [{ title: "Pampers", slug: "clothing" }, { title: "Fisher-Price", slug: "toys" }, { title: "Philips Avent", slug: "feeding" }, { title: "Huggies", slug: "clothing" }, { title: "Chicco", slug: "nursery" }, { title: "Johnson's", slug: "clothing" }] },
    ] },
  { title: "Gaming", slug: "gaming", icon: "M7 10h10a4 4 0 0 1 3 6l-1 2a2 2 0 0 1-3 0l-2-2H10l-2 2a2 2 0 0 1-3 0l-1-2a4 4 0 0 1 3-6Zm1 3v3m-1.5-1.5h3M16 14h.01M18 15h.01", categories: ["electronics"], subCategories: [{ title: "Consoles", slug: "consoles" }, { title: "Accessories", slug: "accessories" }, { title: "Controllers", slug: "controllers" }, { title: "Audio", slug: "audio" }, { title: "Streaming", slug: "streaming" }, { title: "Gaming PCs", slug: "gaming-pcs" }],
    subGroups: [
      { title: "Consoles", links: [{ title: "PlayStation 5", slug: "consoles" }, { title: "Xbox Series X", slug: "consoles" }, { title: "Nintendo Switch", slug: "consoles" }, { title: "Handheld Consoles", slug: "consoles" }] },
      { title: "Controllers & Accessories", links: [{ title: "Gamepads", slug: "controllers" }, { title: "Steering Wheels", slug: "controllers" }, { title: "Gaming Headsets", slug: "audio" }, { title: "Charging Docks", slug: "accessories" }, { title: "Cases & Skins", slug: "accessories" }] },
      { title: "Streaming & Gear", links: [{ title: "Capture Cards", slug: "streaming" }, { title: "Microphones", slug: "streaming" }, { title: "Webcams", slug: "streaming" }, { title: "Gaming Chairs", slug: "accessories" }] },
      { title: "Gaming PCs", links: [{ title: "Gaming Laptops", slug: "gaming-pcs" }, { title: "Gaming Desktops", slug: "gaming-pcs" }, { title: "Gaming Monitors", slug: "gaming-pcs" }] },
      { title: "Top Brands", links: [{ title: "Sony", slug: "consoles" }, { title: "Microsoft", slug: "consoles" }, { title: "Nintendo", slug: "consoles" }, { title: "Logitech", slug: "controllers" }, { title: "Razer", slug: "controllers" }, { title: "Corsair", slug: "accessories" }] },
    ] },
  { title: "Other categories", slug: "other-categories", icon: "M12 5a7 7 0 1 0 0 14 7 7 0 0 0-14 0Zm-3 7h.01M12 12h.01M15 12h.01", categories: ["pets", "stickers"], subCategories: [{ title: "Pets", slug: "pets" }, { title: "Stationery", slug: "stationery" }, { title: "Outdoor", slug: "outdoor" }, { title: "Travel", slug: "travel" }, { title: "Seasonal", slug: "seasonal" }, { title: "Sports & Fitness", slug: "sports" }],
    subGroups: [
      { title: "Sports & Outdoor", links: [{ title: "Camping Gear", slug: "outdoor" }, { title: "Fitness Equipment", slug: "outdoor" }, { title: "Cycling", slug: "outdoor" }, { title: "Luggage", slug: "travel" }] },
      { title: "Sports & Fitness", links: [{ title: "Fitness Equipment", slug: "sports" }, { title: "Sportswear", slug: "sports" }, { title: "Team Sports", slug: "sports" }] },
      { title: "Sports & Fitness", links: [{ title: "Fitness Equipment", slug: "sports" }, { title: "Sportswear", slug: "sports" }, { title: "Team Sports", slug: "sports" }] },
      { title: "Pets & Stationery", links: [{ title: "Pet Food", slug: "pets" }, { title: "Pet Toys", slug: "pets" }, { title: "Notebooks", slug: "stationery" }, { title: "Pens & Pencils", slug: "stationery" }] },
      { title: "Seasonal", links: [{ title: "Holiday Decor", slug: "seasonal" }, { title: "Gift Sets", slug: "seasonal" }, { title: "Party Supplies", slug: "seasonal" }] },
      { title: "Top Brands", links: [{ title: "Decathlon", slug: "outdoor" }, { title: "Samsonite", slug: "travel" }, { title: "Bic", slug: "stationery" }, { title: "Pedigree", slug: "pets" }] },
    ] },
];

export const categoryGroupMap = new Map(categoryGroups.map((group) => [group.slug.toLowerCase(), group]));

// All product photos come through this helper, so the link settings live in ONE place.
// Card photos are SQUARE crops (w=800&h=800&fit=crop), so every product card fills evenly with object-fit: cover.
// The product page asks for the same photo uncropped (see fullPhoto in lib/images.ts) so shoppers see all of it.
// `variant` adds a harmless tag so two entries for the same photo stay distinct.
// When a real back end supplies image URLs, this helper and the literals below go away.
const photo = (id: string, variant?: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop${variant ? `&ixid=${variant}` : ""}`;

export const products: Product[] = [
  {
    id: "1",
    handle: "acme-circles-tshirt",
    title: "General Store Circles T-Shirt",
    description: "A classic t-shirt with a unique circles design. Soft cotton, perfect everyday wear.",
    price: 20.0,
    currency: "USD",
    image: photo("1521572163474-6864f9cf17ab"),
    images: [
      photo("1521572163474-6864f9cf17ab"),
      photo("1503341504253-dff4815485f1"),
      photo("1583743814966-8936f5b7be1a"),
    ],
    category: "shirts",
    subcategory: "t-shirts",
    collections: ["hidden-homepage-featured-items", "hidden-homepage-carousel"],
    featured: true,
  },
  {
    id: "2",
    handle: "acme-drawstring-bag",
    title: "General Store Drawstring Bag",
    description: "Lightweight and durable drawstring bag. Ideal for gym, travel, or daily use.",
    price: 12.0,
    currency: "USD",
    image: photo("1553062407-98eeb64c6a62"),
    images: [
      photo("1553062407-98eeb64c6a62"),
    ],
    category: "bags",
    subcategory: "bags",
    collections: ["hidden-homepage-featured-items", "hidden-homepage-carousel"],
  },
  {
    id: "3",
    handle: "acme-cup",
    title: "General Store Cup",
    description: "Ceramic mug with a clean minimal design. Perfect for your morning coffee or tea.",
    price: 15.0,
    currency: "USD",
    image: photo("1514228742587-6b1558fcca3d"),
    images: [
      photo("1514228742587-6b1558fcca3d"),
      photo("1577937927133-66ef06acdf18"),
    ],
    category: "drinkware",
    subcategory: "kitchen",
    collections: ["hidden-homepage-featured-items", "hidden-homepage-carousel"],
  },
  {
    id: "4",
    handle: "acme-hoodie",
    title: "General Store Hoodie",
    description: "Premium heavyweight hoodie. Soft fleece lining and modern fit.",
    price: 50.0,
    currency: "USD",
    image: photo("1556821840-3a63f95609a7"),
    images: [
      photo("1556821840-3a63f95609a7"),
      photo("1578681994506-b8f463449011"),
    ],
    category: "hoodies",
    subcategory: "hoodies",
    collections: ["hidden-homepage-carousel"],
  },
  {
    id: "5",
    handle: "acme-baby-onesie",
    title: "General Store Baby Onesie",
    description: "Soft organic cotton onesie for the little ones. Gentle on skin.",
    price: 10.0,
    currency: "USD",
    image: photo("1515488042361-ee00e0ddd4e4"),
    images: [
      photo("1515488042361-ee00e0ddd4e4"),
    ],
    category: "kids",
    subcategory: "clothing",
    collections: ["hidden-homepage-carousel"],
  },
  {
    id: "6",
    handle: "acme-cowboy-hat",
    title: "General Store Cowboy Hat",
    description: "Classic black cowboy hat with General Store branding. Stylish and durable.",
    price: 160.0,
    currency: "USD",
    image: photo("1514327605112-b887c0e61c0a"),
    images: [
      photo("1514327605112-b887c0e61c0a"),
      photo("1534214526114-0ea4d47b04f2"),
    ],
    category: "headwear",
    subcategory: "headwear",
    collections: ["hidden-homepage-carousel"],
  },
  {
    id: "7",
    handle: "acme-sticker",
    title: "General Store Sticker Pack",
    description: "Set of high-quality vinyl stickers. Weatherproof and long-lasting.",
    price: 5.0,
    currency: "USD",
    image: photo("1611532736597-de2d4265fba3"),
    images: [
      photo("1611532736597-de2d4265fba3"),
    ],
    category: "stickers",
    subcategory: "stationery",
    collections: ["hidden-homepage-carousel"],
  },
  {
    id: "8",
    handle: "acme-keyboard",
    title: "General Store Keyboard",
    description: "Mechanical keyboard with clean design. Perfect for productivity.",
    price: 150.0,
    currency: "USD",
    image: photo("1587829741301-dc798b83add3"),
    images: [
      photo("1587829741301-dc798b83add3"),
      photo("1595225476474-87563907a212"),
    ],
    category: "electronics",
    subcategory: "accessories",
    collections: ["hidden-homepage-carousel"],
  },
  {
    id: "9",
    handle: "acme-tshirt",
    title: "General Store T-Shirt",
    description: "Classic black t-shirt with subtle General Store logo. Soft and comfortable.",
    price: 20.0,
    currency: "USD",
    image: photo("1503342217505-b0a15ec3261c"),
    images: [
      photo("1503342217505-b0a15ec3261c"),
    ],
    category: "shirts",
    collections: ["hidden-homepage-carousel"],
  },
  {
    id: "10",
    handle: "acme-prism-tshirt",
    title: "General Store Prism T-Shirt",
    description: "Black t-shirt with colorful prism design. Stand out from the crowd.",
    price: 25.0,
    currency: "USD",
    image: photo("1523381210434-271e8be1f52b"),
    images: [
      photo("1523381210434-271e8be1f52b"),
    ],
    category: "shirts",
    collections: ["hidden-homepage-carousel"],
  },
  {
    id: "11",
    handle: "acme-runner-sneakers",
    title: "General Store Runner Sneakers",
    description: "Lightweight everyday sneakers with a cushioned sole and clean modern profile.",
    price: 85.0,
    currency: "USD",
    image: photo("1542291026-7eec264c27ff"),
    images: [
      photo("1542291026-7eec264c27ff"),
      photo("1549298916-b41d501d3772"),
      photo("1552346154-21d32810aba3"),
    ],
    category: "footwear",
    subcategory: "footwear",
  },
  {
    id: "12",
    handle: "acme-field-jacket",
    title: "General Store Field Jacket",
    description: "A versatile utility jacket with a relaxed fit for cool-weather layering.",
    price: 110.0,
    currency: "USD",
    image: photo("1551028719-00167b16eac5"),
    images: [
      photo("1551028719-00167b16eac5"),
      photo("1548883354-7622d03aca27"),
      photo("1591047139829-d91aecb6caea"),
      photo("1529139574466-a303027c1d8b"),
    ],
    category: "jackets",
    subcategory: "jackets",
  },
  {
    id: "13",
    handle: "acme-pet-bandana",
    title: "General Store Pet Bandana",
    description: "A soft, adjustable bandana made for comfortable walks and weekend adventures.",
    price: 18.0,
    currency: "USD",
    image: photo("1558788353-f76d92427f16"),
    images: [
      photo("1558788353-f76d92427f16"),
      photo("1587300003388-59208cc962cb"),
      photo("1548199973-03cce0bbc87b"),
    ],
    category: "pets",
  },
  {
    id: "14",
    handle: "acme-compact-blender",
    title: "General Store Compact Blender",
    description: "A powerful countertop blender for smoothies, sauces, and everyday prep.",
    price: 45.0,
    currency: "USD",
    image: photo("1585659722983-3a675dabf23d"),
    images: [
      photo("1585659722983-3a675dabf23d"),
      photo("1574269909862-7e1d70bb8078"),
    ],
    category: "appliances",
    subcategory: "small-appliances",
  },
  {
    id: "15",
    handle: "acme-smartphone",
    title: "General Store Smartphone",
    description: "A reliable everyday smartphone with a sharp display and all-day battery.",
    price: 299.0,
    currency: "USD",
    image: photo("1580910051074-3eb694886505"),
    images: [
      photo("1580910051074-3eb694886505"),
      photo("1598327105666-5b89351aff97"),
    ],
    category: "phones",
    subcategory: "smartphones",
  },
  {
    id: "16",
    handle: "acme-daily-face-cream",
    title: "General Store Daily Face Cream",
    description: "A lightweight daily moisturizer that hydrates without a greasy finish.",
    price: 22.0,
    currency: "USD",
    image: photo("1556228720-195a672e8a03"),
    images: [
      photo("1556228720-195a672e8a03"),
      photo("1571781926291-c477ebfd024b"),
    ],
    category: "beauty",
    subcategory: "skincare",
  },
  {
    id: "17",
    handle: "acme-pantry-rice-pack",
    title: "General Store Pantry Rice Pack",
    description: "Premium long-grain rice, packed for everyday cooking.",
    price: 8.0,
    currency: "USD",
    image: photo("1543168256-418811576931"),
    images: [
      photo("1543168256-418811576931"),
      photo("1584949091598-c31daaaa4aa9"),
    ],
    category: "groceries",
    subcategory: "groceries",
  },
];

const categoryNames: Record<string, string> = {
  bags: "Bag",
  drinkware: "Drinkware",
  electronics: "Electronics",
  footwear: "Footwear",
  headwear: "Headwear",
  hoodies: "Hoodie",
  jackets: "Jacket",
  kids: "Kids",
  pets: "Pet",
  shirts: "Shirt",
  stickers: "Sticker",
  appliances: "Appliance",
  phones: "Phone",
  beauty: "Beauty",
  groceries: "Grocery",
};

const categoryVariants: Record<string, string[]> = {
  bags: ["City Tote", "Trail Pack", "Canvas Carryall", "Mini Crossbody", "Weekender", "Utility Sling", "Travel Pouch", "Market Bag", "Studio Satchel"],
  drinkware: ["Travel Tumbler", "Stoneware Mug", "Glass Bottle", "Thermal Flask", "Espresso Cup", "Cold Brew Glass", "Daily Mug", "Tea Carafe", "Water Bottle"],
  electronics: ["Desk Keyboard", "Wireless Mouse", "Desk Lamp", "Charging Dock", "Compact Speaker", "Travel Charger", "Desk Hub", "Studio Headphones", "Pocket Power Bank"],
  footwear: ["Everyday Trainers", "Canvas Low Tops", "Trail Runners", "Studio Slip-ons", "Court Sneakers", "Leather Loafers", "Weekend Boots", "Cloud Slides", "City Walkers"],
  headwear: ["Canvas Cap", "Ribbed Beanie", "Sun Hat", "Corduroy Cap", "Classic Fedora", "Trail Cap", "Bucket Hat", "Wool Beret", "Daily Visor"],
  hoodies: ["Core Pullover", "Zip Hoodie", "Studio Hoodie", "Heavyweight Hoodie", "Weekend Fleece", "Everyday Crew", "Relaxed Hoodie", "Soft Terry Hoodie", "Travel Hoodie"],
  jackets: ["Canvas Overshirt", "Rain Shell", "Quilted Layer", "Utility Coat", "Liner Jacket", "Coach Jacket", "Harrington Jacket", "Puffer Vest", "Field Anorak"],
  kids: ["Everyday Onesie", "Playtime Set", "Soft Baby Tee", "Mini Hoodie", "Organic Leggings", "Cotton Romper", "Little Cap", "Sleep Set", "Baby Bib Set"],
  pets: ["Walk Bandana", "Everyday Collar", "Leash Set", "Pet Bowl", "Cozy Mat", "Treat Pouch", "Travel Blanket", "Toy Bundle", "Grooming Kit"],
  shirts: ["Everyday Tee", "Studio Tee", "Logo Tee", "Relaxed Tee", "Pocket Tee", "Heavyweight Tee", "Weekend Tee", "Striped Tee", "Long Sleeve Tee"],
  stickers: ["Logo Sheet", "Studio Set", "Travel Set", "Color Pack", "Outdoor Set", "Mini Sheet", "Laptop Set", "Icon Pack", "Label Pack"],
  appliances: ["Compact Blender", "Digital Air Fryer", "Electric Kettle", "2-Slice Toaster", "Rice Cooker", "Stand Mixer"],
  phones: ["Smartphone", "Android Phone", "Budget Phone", "Camera Phone", "5G Phone", "Flagship Phone"],
  beauty: ["Face Cream", "Body Lotion", "Facial Serum", "Lip Balm Set", "Body Wash", "Hair Oil"],
  groceries: ["Pantry Rice Pack", "Pasta Bundle", "Cooking Oil", "Breakfast Cereal", "Canned Tomatoes", "Snack Pack"],
};

const categoryImages: Record<string, string[]> = {
  bags: [
    photo("1553062407-98eeb64c6a62", "bag-unused"),
    photo("1548036328-c9fa89d128fa"),
    photo("1556306535-38febf6782e7"),
    photo("1590874103328-eac38a683ce7"),
    photo("1622560480605-d83c853bc5c3"),
    photo("1594223274512-ad4803739b7c"),
  ],
  drinkware: [
    photo("1495474472287-4d71bcdd2085"),
    photo("1544145945-f90425340c7e"),
    photo("1602143407151-7111542de6e8"),
    photo("1551024709-8f23befc6f87"),
    photo("1513558161293-cdaf765ed2fd"),
    photo("1572119865084-43c285814d63"),
  ],
  electronics: [
    photo("1517336714739-489689fd1ca8"),
    photo("1496181133206-80ce9b88a853"),
    photo("1511707171634-5f897ff02aa9"),
    photo("1527443224154-c4a3942d3acf"),
    photo("1593642532400-2682810df593"),
    photo("1603302576837-37561b2e2302"),
  ],
  footwear: [
    photo("1552346154-21d32810aba3", "shoe-unused"),
    photo("1525966222134-fcfa99b8ae77"),
    photo("1560769629-975ec94e6a86"),
    photo("1543163521-1bf539c55dd2"),
    photo("1460353581641-37baddab0fa2"),
    photo("1543508282-6319a3e2621f"),
  ],
  headwear: [
    photo("1534214526114-0ea4d47b04f2", "hat-unused"),
    photo("1575428652377-a2d80e2277fc"),
    photo("1576871337622-98d48d1cf531"),
    photo("1588850561407-ed78c282e89b"),
    photo("1556306535-0f09a537f0a3"),
    photo("1521369909029-2afed882baee"),
  ],
  hoodies: [
    photo("1578681994506-b8f463449011"),
    photo("1576566588028-4147f3842f27"),
    photo("1515886657613-9f3515b0c78f"),
    photo("1551488831-00ddcb6c6bd3"),
    photo("1564557287817-3785e38ec1f5"),
    photo("1618354691373-d851c5c3a990"),
  ],
  jackets: [
    photo("1591047139829-d91aecb6caea", "jacket-unused"),
    photo("1517841905240-472988babdf9"),
    photo("1512436991641-6745cdb1723f"),
    photo("1543076447-215ad9ba6923"),
    photo("1520975954732-35dd22299614"),
    photo("1571945153237-4929e783af4a"),
  ],
  kids: [
    photo("1503919545889-aef636e10ad4"),
    photo("1602030028438-4cf153cbae9e"),
    photo("1596464716127-f2a82984de30"),
    photo("1587654780291-39c9404d746b"),
    photo("1529333166437-7750a6dd5a70"),
    photo("1516627145497-ae6968895b74"),
  ],
  pets: [
    photo("1560807707-8cc77767d783"),
    photo("1517849845537-4d257902454a"),
    photo("1592194996308-7b43878e84a6"),
    photo("1583337130417-3346a1be7dee"),
    photo("1530281700549-e82e7bf110d6"),
    photo("1552053831-71594a27632d"),
  ],
  shirts: [
    photo("1521572163474-6864f9cf17ab", "shirt-unused-one"),
    photo("1503341504253-dff4815485f1", "shirt-unused-two"),
    photo("1583743814966-8936f5b7be1a", "shirt-unused-three"),
    photo("1562157873-818bc0726f68"),
    photo("1556905055-8f358a7a47b2"),
    photo("1596755094514-f87e34085b2c"),
  ],
  stickers: [
    photo("1611532736597-de2d4265fba3", "sticker-unused"),
    photo("1586953208448-b95a79798f07"),
    photo("1606312619070-d48b4c652a52"),
    photo("1614036417651-efe5912149d8"),
    photo("1618842676088-c4d48a6a7c9d"),
    photo("1561214115-f2f134cc4912"),
  ],
  appliances: [
    photo("1585515320310-259814833e62"),
    photo("1586201375761-83865001e31c"),
    photo("1571175443880-49e1d25b2bc5"),
    photo("1556909212-d5b604d0c90d"),
    photo("1622480916113-9000ac49b79d"),
    photo("1585237017125-24baf8d7406f"),
  ],
  phones: [
    photo("1605236453806-6ff36851218e"),
    photo("1601784551446-20c9e07cdbdb"),
    photo("1512499617640-c74ae3a79d37"),
    photo("1533228100845-08145b01de14"),
    photo("1585060544812-6b45742d762f"),
    photo("1611791484670-ce19b801d192"),
  ],
  beauty: [
    photo("1556228720-195a672e8a03", "beauty-unused"),
    photo("1522335789203-aabd1fc54bc9"),
    photo("1620916566398-39f1143ab7be"),
    photo("1608248543803-ba4f8c70ae0b"),
    photo("1598440947619-2c35fc9aa908"),
    photo("1585652757173-57de5e9fab42"),
  ],
  groceries: [
    photo("1543168256-418811576931", "groceries-unused"),
    photo("1506617420156-8e4536971650"),
    photo("1542838132-92c53300491e"),
    photo("1578916171728-46686eac8d58"),
    photo("1550989460-0adf9ea622e2"),
    photo("1584385002340-d886f3a0f097"),
  ],
};

const productsPerCategory = 6;

for (const [category, label] of Object.entries(categoryNames)) {
  const seeds = products.filter((product) => product.category === category);
  for (let index = seeds.length; index < productsPerCategory; index += 1) {
    const seed = seeds[index % seeds.length];
    const variant = categoryVariants[category][index];
    const image = categoryImages[category][index] || seed.image;
    products.push({
      ...seed,
      id: String(products.length + 1),
      handle: `acme-${category}-${index + 1}`,
      title: `General Store ${variant || `${label} ${index + 1}`}`,
      image,
      collections: [],
      featured: false,
      images: [image],
    });
  }
}

// Merge the separate write-ups (description + highlights) into each product.
for (const product of products) {
  const copy = productCopy[product.handle];
  if (copy) Object.assign(product, copy);
}

for (const product of products) {
  const gallery = [product.image, ...product.images].filter(
    (image, index, images) => image && images.indexOf(image) === index
  );
  product.images = gallery.slice(0, 3);
}

export function getProduct(handle: string) {
  return products.find((p) => p.handle === handle);
}

export function getProductsByCategory(category: string, subcategory?: string) {
  if (!category || category === "all") return products;

  const group = categoryGroupMap.get(category.toLowerCase());
  let filtered = products;

  if (group) {
    filtered = group.categories.length === 0 ? products : products.filter((product) => group.categories.includes(product.category));
  } else {
    filtered = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (!subcategory) {
    return filtered;
  }

  const normalizedSubcategory = subcategory.toLowerCase();
  return filtered.filter((product) => {
    const current = product.subcategory?.toLowerCase() ?? product.category.toLowerCase();
    return current === normalizedSubcategory;
  });
}

export function getCategoryLabel(category: string) {
  return categoryGroupMap.get(category.toLowerCase())?.title
    ?? category.charAt(0).toUpperCase() + category.slice(1);
}

export function getSubcategoryLabel(category: string, subcategory: string) {
  const group = categoryGroupMap.get(category.toLowerCase());
  return group?.subCategories.find((item) => item.slug === subcategory.toLowerCase())?.title
    ?? subcategory.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function getCategoryRoute(category: string) {
  return `/search/${category}`;
}

export function getSubcategoryRoute(category: string, subcategory: string) {
  return `/search/${category}/${subcategory}`;
}

export function getCollectionProducts(collection: string) {
  return products.filter((product) => product.collections?.includes(collection));
}

export function getFilteredProducts({
  category,
  subcategory,
  query,
  sort,
  extraText,
}: {
  category?: string;
  subcategory?: string;
  query?: string;
  sort?: string | null;
  /** Extra words to search per product (brand, seller name ...), supplied by the caller. */
  extraText?: (product: Product) => string;
}) {
  let filtered = category && category !== "all"
    ? getProductsByCategory(category, subcategory)
    : products;

  // Word-by-word search with typo/synonym tolerance. The result is already in relevance order.
  if (query?.trim()) {
    filtered = searchProducts(filtered, query, { extraText });
  }

  switch (sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "latest-desc":
      return [...filtered].sort((a, b) => Number(b.id) - Number(a.id));
    case "relevance":
      return filtered;
    case "trending-desc":
      return [...filtered].sort((a, b) => Number(b.featured ?? 0) - Number(a.featured ?? 0));
    default:
      return filtered;
  }
}
