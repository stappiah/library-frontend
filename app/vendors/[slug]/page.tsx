"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/sections/product-card";
import { getVendorBySlug, getProductsForVendor } from "@/lib/services/catalog-service";
import type { Product, VendorProfile } from "@/types/ecommerce";

export default function VendorStorePage() {
  const params = useParams();
  const slug = useMemo(() => {
    const value = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    return value ?? "";
  }, [params.slug]);

  const [store, setStore] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    setIsLoaded(false);

    getVendorBySlug(slug)
      .then((vendor) => {
        setStore(vendor);
        return getProductsForVendor(slug);
      })
      .then(setProducts)
      .catch(() => {
        setStore(null);
        setProducts([]);
      })
      .finally(() => setIsLoaded(true));
  }, [slug]);

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Loading storefront</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Please wait while we load this vendor.</h1>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Vendor not found</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">This storefront is not available yet.</h1>
          <Link href="/vendors" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to all vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <Link href="/vendors" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to vendors
      </Link>

      <div className="mt-6 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.24)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              <Sparkles className="h-4 w-4" /> {store.specialties[0] || "Faculty vendor"}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 dark:text-white">{store.name}</h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{store.bio}</p>
          </div>
          <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {store.location ?? "Online"}
            </div>
            <div className="mt-2 font-semibold text-zinc-950 dark:text-white">{store.productsCount} products available</div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Featured collection</p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">Resources from {store.name}</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
