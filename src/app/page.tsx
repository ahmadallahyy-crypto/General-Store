import { GeneralHome } from "@/components/home/general-home";
import { categoryGroups } from "@/data/products";
import { flashSaleProducts, marketplaceProducts, sellers } from "@/lib/mock/marketplace";

export default function HomePage() {
  return (
    <GeneralHome
      products={marketplaceProducts}
      flashProducts={flashSaleProducts}
      sellers={sellers}
      groups={categoryGroups}
    />
  );
}
