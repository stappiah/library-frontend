"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/ecommerce";

export function ProductGallery({ product }: { product: Product }) {
  const validImages = product.images.filter(Boolean);
  const [selected, setSelected] = useState(validImages[0] ?? null);

  if (!selected) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">No image available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Image src={selected} alt={product.title} fill loading="eager" className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {validImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelected(image)}
            className={`relative aspect-square overflow-hidden rounded-[20px] border ${
              selected === image ? "border-zinc-950 dark:border-white" : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <Image src={image} alt={product.title} fill className="object-cover" sizes="120px" />
          </button>
        ))}
      </div>
    </div>
  );
}
