"use client";

import Link from "next/link";
import { HeartOff } from "lucide-react";
import { ProductGrid } from "@/components/sections/product-grid";
import { useAppStore } from "@/store/app-store";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function WishlistPage() {
  const { wishlist } = useAppStore();
  const catalogProducts = useSelector((state: RootState) => state.catalog.products);
  const savedProducts = catalogProducts.filter((product) => wishlist.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Wishlist</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Your saved pieces</h1>
      </div>

      {savedProducts.length === 0 ? (
        <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white px-8 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <HeartOff className="mx-auto h-8 w-8 text-zinc-500" />
          <p className="mt-4 text-lg font-semibold">Nothing saved yet</p>
          <p className="mt-2 text-sm text-zinc-500">Tap the heart on any product to build a collection you can revisit.</p>
          <Link href="/shop" className="mt-5 inline-flex text-sm font-semibold text-zinc-950 dark:text-white">
            Start exploring
          </Link>
        </div>
      ) : (
        <ProductGrid products={savedProducts} />
      )}
    </div>
  );
}
