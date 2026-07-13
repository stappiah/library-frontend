import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/sections/product-grid";
import { getCategories, getProductsByCategory } from "@/lib/services/catalog-service";

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, featured] = await Promise.all([getCategories(), getProductsByCategory(slug)]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Category</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">{category.name}</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{category.description}</p>
      </div>

      {featured.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No products are available in this category yet.</p>
      ) : (
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      )}
    </div>
  );
}
