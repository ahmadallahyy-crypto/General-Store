import {
  FREE_DELIVERY_THRESHOLD,
  HOME_DELIVERY_ETA,
  HOME_DELIVERY_FEE,
  PICKUP_ETA,
  RETURN_WINDOW_DAYS,
  formatMoney,
} from "@/lib/store-policies";

// Wording for the About / Contact / Shipping / Returns / Terms / Privacy pages.
// Numbers (delivery fee, return window ...) come from lib/store-policies.ts so they never disagree with checkout.
// Replace the contact details and have the legal wording reviewed before launch. When a CMS or back end
// exists, this file can be replaced by content from it; the route and page layout stay the same.

export const CONTACT = {
  email: "support@generalstore.example",
  phone: "+234 800 000 0000",
  hours: "Monday to Saturday, 8am to 6pm",
};

export type InfoSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type InfoPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: InfoSection[];
  /** Shows a "have this reviewed before launch" note (used on legal pages). */
  needsLegalReview?: boolean;
};

export const infoPages: InfoPage[] = [
  {
    slug: "about",
    title: "About General-Store",
    description: "Who we are and how General-Store works.",
    intro: "General-Store is an online marketplace where independent sellers and official brand stores share one simple shopping experience.",
    sections: [
      { heading: "What we do", paragraphs: ["We bring fashion, electronics, home, beauty and everyday essentials together in one place, so you can compare, buy and track your orders without switching between shops."] },
      { heading: "How it works", bullets: ["Browse official stores and trusted sellers.", "Add what you like to one cart, even from different sellers.", "Check out once. We pass each seller their part of your order.", `Pick up at a station in ${PICKUP_ETA}, or get it delivered in ${HOME_DELIVERY_ETA}.`] },
      { heading: "Our promise", bullets: [`Free returns within ${RETURN_WINDOW_DAYS} days on eligible items.`, "Clear prices, with delivery shown before you pay.", "Real people to talk to when something goes wrong."] },
    ],
  },
  {
    slug: "contact",
    title: "Contact us",
    description: "Get in touch with General-Store support.",
    intro: "Questions about an order, a delivery or a return? Send us a message and we will get back to you.",
    sections: [
      { heading: "Other ways to reach us", bullets: [`Email: ${CONTACT.email}`, `Phone: ${CONTACT.phone}`, `Hours: ${CONTACT.hours}`] },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping and delivery",
    description: "Delivery options, fees and timings.",
    intro: "Choose how you want to receive your order at checkout. The fee is always shown before you pay.",
    sections: [
      { heading: "Delivery options", bullets: [`Pickup station: free, ready in ${PICKUP_ETA}.`, `Home delivery: ${formatMoney(HOME_DELIVERY_FEE)}, arrives in ${HOME_DELIVERY_ETA}.`, `Free home delivery on orders of ${formatMoney(FREE_DELIVERY_THRESHOLD)} or more.`] },
      { heading: "Before it arrives", paragraphs: ["Add a working phone number at checkout. The courier calls it before delivery, so please keep it close on the day."] },
      { heading: "Orders from several sellers", paragraphs: ["If your cart has items from more than one seller, they may arrive in separate packages and on different days. Each package is tracked on your order page."] },
    ],
  },
  {
    slug: "returns",
    title: "Returns and refunds",
    description: "How returns and refunds work.",
    intro: `Changed your mind or got the wrong item? You have ${RETURN_WINDOW_DAYS} days to return most items.`,
    sections: [
      { heading: "What you can return", bullets: [`Items in their original condition, within ${RETURN_WINDOW_DAYS} days of delivery.`, "Items that arrived damaged, faulty or not as described."] },
      { heading: "What we cannot take back", bullets: ["Perishable groceries and opened personal-care items.", "Items marked as final sale on the product page."] },
      { heading: "How a refund works", paragraphs: ["Start a return from your order page. Once the seller receives and checks the item, your refund goes back to the way you paid. Allow a few business days for it to show."] },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "The rules for using General-Store.",
    intro: "By using General-Store you agree to these terms. Please read them before placing an order.",
    needsLegalReview: true,
    sections: [
      { heading: "Using the store", paragraphs: ["You must give accurate details when you create an account or place an order, and keep your sign-in details private."] },
      { heading: "Orders and prices", paragraphs: ["Prices are shown before you pay. An order is confirmed once payment or the pay-on-delivery choice is accepted. We may cancel an order if an item is out of stock or a price was listed in error, and you will be refunded in full."] },
      { heading: "Sellers", paragraphs: ["Many products are sold by independent sellers. Each seller is responsible for their listings, and we step in to help if there is a problem with an order."] },
      { heading: "Changes", paragraphs: ["We may update these terms from time to time. The date of the latest version is shown on this page."] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How General-Store uses your information.",
    intro: "We only collect what we need to run your orders and improve the store.",
    needsLegalReview: true,
    sections: [
      { heading: "What we collect", bullets: ["Details you give us: name, email, phone and delivery address.", "Order history and items you save.", "Your recent searches, saved on your own device to help you shop faster."] },
      { heading: "How we use it", bullets: ["To process, deliver and support your orders.", "To keep your account secure.", "To improve what we show you."] },
      { heading: "Cookies and local storage", paragraphs: ["We store your cart, wishlist and recent searches in your browser so they are still there when you come back. You can clear them at any time from your browser settings, or use the Clear option on the search suggestions."] },
      { heading: "Your choices", paragraphs: [`You can ask us to see, correct or delete your information at any time by contacting ${CONTACT.email}.`] },
    ],
  },
];

export const getInfoPage = (slug: string) => infoPages.find((page) => page.slug === slug);
