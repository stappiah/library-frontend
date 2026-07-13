"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/sections/product-card";
import type { Product } from "@/types/ecommerce";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
