"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Heart, Library, Star, Truck } from "lucide-react";
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
      setQuantity(1);
    }
  }, [product]);

  const { addToCart, toggleWishlist, wishlist } = useAppStore();

  const relatedProducts = useMemo(
    () =>
      product
        ? catalogProducts.filter((item) => item.id !== product.id && (item.category?.slug === product.category?.slug || item.vendor?.slug === product.vendor?.slug)).slice(0, 3)
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
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{product.vendor?.name ?? "Independent publisher"}</p>
              <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">{product.title}</h1>
            </div>
            <Badge>{product.isFeatured ? "Featured" : product.productType}</Badge>
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
            <p className="text-3xl font-bold text-zinc-950 dark:text-white">{formatCurrency(product.discountPrice ?? product.price)}</p>
            {product.discountPrice != null && (
              <p className="text-sm text-zinc-500 line-through">{formatCurrency(product.price)}</p>
            )}
          </div>

          <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-300">{product.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
                <BookOpen className="h-4 w-4" />
                Category
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{product.category?.name ?? "Uncategorized"}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
                <Library className="h-4 w-4" />
                Faculty
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{product.faculty?.name ?? "General"}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
                <FileText className="h-4 w-4" />
                Format
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{product.productType}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
                <Truck className="h-4 w-4" />
                Downloads
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{product.fileName ? `Ready (${product.downloadLimit} max)` : "Preview only"}</p>
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

          <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
              <Truck className="h-4 w-4" />
              Free shipping on orders over ₵1,500
            </div>
            <p className="mt-2 text-sm text-zinc-500">Estimated delivery: 3–5 business days</p>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">About this resource</p>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{product.description}</p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Publisher details</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li><span className="font-semibold text-zinc-950 dark:text-white">Author:</span> {product.author}</li>
              <li><span className="font-semibold text-zinc-950 dark:text-white">Publisher:</span> {product.publisher ?? "Not listed"}</li>
              <li><span className="font-semibold text-zinc-950 dark:text-white">ISBN:</span> {product.isbn ?? "Not listed"}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Related products</p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">Discover more from this lecturer and category</h2>
          </div>
        </div>
        <div className="mt-6">
          <ProductGrid products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
