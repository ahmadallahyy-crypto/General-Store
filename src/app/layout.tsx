import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/components/auth/auth-context";
import { CartProvider } from "@/components/cart/cart-context";
import { WishlistProvider } from "@/components/wishlist/wishlist-context";
import { Footer } from "@/components/layout/footer";
import { CartDock } from "@/components/cart/cart-dock";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: {
    default: "General-Store",
    template: "%s | General-Store",
  },
  description: "High-performance ecommerce store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ubuntu.variable} data-scroll-behavior="smooth">
      <body className="bg-white text-[#111827] selection:bg-[#e2f7f9]">
        <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            {/* Keep the cart sidebar available without reserving its width on empty-cart pages. */}
            <div className="page-shell flex">
              <main className="min-w-0 flex-1">{children}</main>
              <CartDock />
            </div>
            <Footer />
          </WishlistProvider>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
