"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { Heart, Minus, Plus, Star, Truck } from "lucide-react";
import { ProductGallery } from "@/components/sections/product-gallery";
import { ProductGrid } from "@/components/sections/product-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getProductBySlug, getProducts } from "@/lib/services/catalog-service";
import type { Product } from "@/types/ecommerce";
import { useAppStore } from "@/store/app-store";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (!slug) {
      return;
    }

    let isMounted = true;

    const loadProduct = async () => {
      const [foundProduct, products] = await Promise.all([getProductBySlug(slug), getProducts()]);
      if (isMounted) {
        setProduct(foundProduct ?? null);
        setCatalogProducts(products);
      }
    };

    void loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] ?? "");
      setSelectedSize(product.sizes[0] ?? "");
      setQuantity(1);
    }
  }, [product]);

  const { addToCart, toggleWishlist, wishlist } = useAppStore();

  const relatedProducts = useMemo(
    () =>
      product
        ? catalogProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3)
        : [],
    [catalogProducts, product]
  );

  const saved = product ? wishlist.includes(product.id) : false;

  if (!slug) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-lg font-semibold">Invalid product slug.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-lg font-semibold">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery product={product} />

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{product.brand}</p>
              <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">{product.title}</h1>
            </div>
            {product.badge && <Badge>{product.badge}</Badge>}
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.rating}
            </div>
            <span>•</span>
            <span>{product.reviewsCount} reviews</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-bold text-zinc-950 dark:text-white">{formatCurrency(product.price)}</p>
            {product.compareAtPrice && (
              <p className="text-sm text-zinc-500 line-through">{formatCurrency(product.compareAtPrice)}</p>
            )}
          </div>

          <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-300">{product.description}</p>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Color</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selectedColor === color
                        ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                        : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Size</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selectedSize === size
                        ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                        : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Quantity</p>
              <div className="mt-3 flex w-fit items-center gap-3 rounded-full border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => addToCart(product, quantity)}>
              <span>Add to cart</span>
            </Button>
            <Button variant="secondary" size="lg" onClick={() => toggleWishlist(product.id)}>
              <Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>

          <div className="mt-6 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
              <Truck className="h-4 w-4" />
              Free shipping on orders over ₵1,500
            </div>
            <p className="mt-2 text-sm text-zinc-500">Estimated delivery: 3–5 business days</p>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <div className="flex flex-wrap gap-4">
          {[
            { title: "Highlights", content: product.highlights.join(" • ") },
            { title: "Care", content: product.careInstructions.join(" • ") },
          ].map((tab) => (
            <div key={tab.title} className="rounded-[24px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{tab.title}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{tab.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Related products</p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">Pair this with the rest of the edit</h2>
          </div>
        </div>
        <div className="mt-6">
          <ProductGrid products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
