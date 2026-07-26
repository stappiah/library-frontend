"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search, ArrowUpDown } from "lucide-react";
import { FilterSidebar } from "@/components/sections/filter-sidebar";
import { ProductGrid } from "@/components/sections/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/services/catalog-service";
import type { Product } from "@/types/ecommerce";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"];

export default function ShopPage() {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      const data = await getProducts();
      if (isMounted) {
        setProductsData(data);
        setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return productsData
      .filter((product) => {
        const matchesSearch =
          product.title.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
        const matchesPrice =
          priceRange === "All" ||
          (priceRange === "Under ₵100" && product.price < 100) ||
          (priceRange === "₵100 - ₵200" && product.price >= 100 && product.price <= 200) ||
          (priceRange === "₵200+" && product.price > 200);

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "Price: Low to High") return a.price - b.price;
        if (sort === "Price: High to Low") return b.price - a.price;
        if (sort === "Top Rated") return b.rating - a.rating;
        return 0;
      });
  }, [priceRange, productsData, search, selectedBrand, selectedCategory, sort]);

  const brands = ["All", ...new Set(productsData.map((product) => product.brand))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Shop E-books</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Browse quality e-books for tertiary education</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            <Search className="h-4 w-4" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="w-48 border-0 bg-transparent px-0 shadow-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
            <ArrowUpDown className="h-4 w-4 text-zinc-500" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="bg-transparent text-sm outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <Button variant="secondary" className="lg:hidden" onClick={() => setShowFilters((value) => !value)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className={`${showFilters ? "block" : "hidden"} xl:block`}>
          <FilterSidebar
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between text-sm text-zinc-500">
            <p>{filtered.length} products shown</p>
            <p>Filtered for {selectedCategory === "all" ? "all categories" : selectedCategory}</p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-52 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
