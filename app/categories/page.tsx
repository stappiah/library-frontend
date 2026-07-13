import Link from "next/link";
import { CategoryCard } from "@/components/sections/category-card";
import { ProductGrid } from "@/components/sections/product-grid";
import { getCategories, getProducts } from "@/lib/services/catalog-service";
import type { Category, Product } from "@/types/ecommerce";

export default async function CategoriesPage() {
  let categories = [] as Category[];
  let products = [] as Product[];
  let fetchError: string | null = null;

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProducts({}),
    ]);
  } catch (error) {
    fetchError = error instanceof Error ? error.message : String(error);
    console.error("Categories page failed to load data:", error);
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-3xl font-bold text-red-800">Unable to load categories</h1>
          <p className="mt-4 text-base text-red-700">
            There was a problem fetching categories and products from the backend.
          </p>
          <p className="mt-3 text-sm text-red-600">{fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Categories</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">A premium map of every collection</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Explore collections from active vendors and curated subject areas.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Best sellers</p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">Popular picks across the storefront</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-zinc-950 dark:text-white">
            Browse all products
          </Link>
        </div>
        <div className="mt-6">
          <ProductGrid products={products.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
