"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import type { Product } from "@/types/ecommerce";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useAppStore();
  const saved = wishlist.includes(product.id);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.28)] dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900">No image available</div>
        )}
        {product.badge && (
          <div className="absolute left-4 top-4">
            <Badge>{product.badge}</Badge>
          </div>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-zinc-900 backdrop-blur dark:bg-zinc-950/80 dark:text-white"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{product.brand}</p>
            <Link href={`/products/${product.slug}`} className="mt-2 block text-lg font-semibold text-zinc-950 dark:text-white">
              {product.title}
            </Link>
          </div>
          <p className="text-lg font-bold text-zinc-950 dark:text-white">{formatCurrency(product.price)}</p>
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {product.rating} · {product.reviewsCount} reviews
          </div>
          <Button size="sm" onClick={() => addToCart(product)}>
            <ShoppingBag className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
