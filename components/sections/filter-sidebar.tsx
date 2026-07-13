"use client";

import { motion } from "framer-motion";

interface FilterSidebarProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
}

const priceOptions = ["All", "Under $100", "$100 - $200", "$200+"];

export function FilterSidebar({
  brands,
  selectedBrand,
  onBrandChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FilterSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Categories</p>
        <div className="mt-4 space-y-2">
          {[
            { label: "All", value: "all" },
            { label: "Audio", value: "audio" },
            { label: "Wearables", value: "wearables" },
            { label: "Desk", value: "desk" },
            { label: "Lifestyle", value: "lifestyle" },
            { label: "Travel", value: "travel" },
            { label: "Wellness", value: "wellness" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onCategoryChange(item.value)}
              className={`block w-full rounded-2xl px-3 py-2 text-left text-sm ${
                selectedCategory === item.value
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Brands</p>
        <div className="mt-4 space-y-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => onBrandChange(brand)}
              className={`block w-full rounded-2xl px-3 py-2 text-left text-sm ${
                selectedBrand === brand
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Price</p>
        <div className="mt-4 space-y-2">
          {priceOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onPriceRangeChange(option)}
              className={`block w-full rounded-2xl px-3 py-2 text-left text-sm ${
                priceRange === option
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
