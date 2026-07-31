import ProductsManager from "@/components/admin/products-manager";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-cocoa-900">
          Menu Items
        </h1>
        <p className="text-sm text-cocoa-500">
          Add new desserts, change prices, mark bestsellers or hide anything
          that&apos;s sold out for the day.
        </p>
      </header>
      <ProductsManager products={products} />
    </div>
  );
}
