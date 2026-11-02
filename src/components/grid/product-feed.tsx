import { Card } from "@/components/home/product-card";
import type { Product } from "@/data/products";
import { getMarketplaceProduct } from "@/lib/mock/marketplace";
import "./product-feed.css";

/**
 * The home page's product grid, reused on every other page:
 * same Card, same 6-across columns, same gaps. (`flush` removes the home page's side margins,
 * because the page around it already provides them.)
 */
export function ProductFeed({ products, id }: { products: Product[]; id?: string }) {
  return (
    <div className="gs product-feed-grid" id={id}>
      <div className="feed flush">
        {products.map((product) => {
          const item = getMarketplaceProduct(product.id);
          return item ? <Card key={item.id} p={item} flash={item.flashSale} /> : null;
        })}
      </div>
    </div>
  );
}
