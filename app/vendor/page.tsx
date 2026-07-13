"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Store, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBook, createVendor, getCategories, getProductsForVendor, getVendors } from "@/lib/services/catalog-service";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken } from "@/store/slices/authSlice";
import type { Category, Product, VendorProfile } from "@/types/ecommerce";

interface StoreFormState {
  name: string;
  bio: string;
  tagline: string;
  specialty: string;
  location: string;
  email: string;
  phone: string;
  address: string;
}

interface ProductFormState {
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  inventory: number;
  imageUrl: string;
  imageFile: File | null;
  galleryFiles: File[];
}

const productDefaults: ProductFormState = {
  title: "",
  author: "",
  description: "",
  category: "",
  price: 45,
  inventory: 12,
  imageUrl: "",
  imageFile: null,
  galleryFiles: [],
};

const storeDefaults: StoreFormState = {
  name: "",
  bio: "",
  tagline: "",
  specialty: "Education",
  location: "Online",
  email: "",
  phone: "",
  address: "",
};

export default function VendorPortalPage() {
  const [stores, setStores] = useState<VendorProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [storeForm, setStoreForm] = useState<StoreFormState>(storeDefaults);
  const [productForm, setProductForm] = useState<ProductFormState>(productDefaults);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    setIsLoadingStores(true);
    getVendors()
      .then((vendorList) => {
        setStores(vendorList);
        setSelectedStoreId(vendorList[0]?.id ?? null);
      })
      .catch(() => setStores([]))
      .finally(() => setIsLoadingStores(false));
  }, []);

  useEffect(() => {
    setIsLoadingCategories(true);
    getCategories()
      .then((categoryList) => {
        setCategories(categoryList);
        setProductForm((current) =>
          current.category || categoryList.length === 0
            ? current
            : { ...current, category: categoryList[0].slug },
        );
      })
      .catch(() => setCategories([]))
      .finally(() => setIsLoadingCategories(false));
  }, []);

  const activeStore = useMemo(
    () => stores.find((store) => store.id === selectedStoreId) ?? stores[0],
    [selectedStoreId, stores],
  );

  useEffect(() => {
    if (!activeStore) {
      setProducts([]);
      return;
    }

    setIsLoadingProducts(true);
    getProductsForVendor(activeStore.slug)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoadingProducts(false));
  }, [activeStore]);

  const handleCreateStore = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const vendor = await createVendor({
        name: storeForm.name,
        description: storeForm.bio,
        website: storeForm.email,
        phone: storeForm.phone,
        address: storeForm.address,
        email: storeForm.email,
        is_active: true,
      }, accessToken);

      setStores((current) => [vendor, ...current]);
      setSelectedStoreId(vendor.id);
      setStoreForm(storeDefaults);
      setMessage("Storefront created successfully.");
    } catch {
      setError("Unable to create storefront. Please sign in and try again.");
    }
  };

  const handleAddProduct = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!activeStore) {
      setError("Please select a storefront before adding products.");
      return;
    }

    try {
      const book = await createBook({
        title: productForm.title,
        author: productForm.author,
        description: productForm.description,
        price: productForm.price,
        stock: productForm.inventory,
        image_url: productForm.imageUrl || undefined,
        imageFile: productForm.imageFile || undefined,
        galleryFiles: productForm.galleryFiles,
        category: productForm.category,
      }, accessToken);

      setProducts((current) => [book, ...current]);
      setProductForm(productDefaults);
      setMessage("Product published successfully.");
    } catch {
      setError("Unable to publish product. Please sign in as a vendor and try again.");
    }
  };

  const ownerProducts = useMemo(
    () => products.filter((product) => product.vendorSlug === activeStore?.slug),
    [activeStore?.slug, products],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Vendor portal</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            Create your storefront and list products in minutes.
          </h1>
        </div>
        <Link href="/vendors" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
          Explore storefronts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-zinc-100 p-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Create a store</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Set up your teaching identity and storefront details.</p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleCreateStore}>
            <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Store name" value={storeForm.name} onChange={(event) => setStoreForm((current) => ({ ...current, name: event.target.value }))} required />
            <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Short tagline" value={storeForm.tagline} onChange={(event) => setStoreForm((current) => ({ ...current, tagline: event.target.value }))} required />
            <textarea className="min-h-24 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Store bio" value={storeForm.bio} onChange={(event) => setStoreForm((current) => ({ ...current, bio: event.target.value }))} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Specialty" value={storeForm.specialty} onChange={(event) => setStoreForm((current) => ({ ...current, specialty: event.target.value }))} required />
              <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Location" value={storeForm.location} onChange={(event) => setStoreForm((current) => ({ ...current, location: event.target.value }))} required />
            </div>
            <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Contact email" type="email" value={storeForm.email} onChange={(event) => setStoreForm((current) => ({ ...current, email: event.target.value }))} required />
            <Button type="submit" className="w-full">Create storefront</Button>
          </form>
        </div>

        <div className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-zinc-100 p-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Upload a product</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Publish a resource to your storefront instantly.</p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleAddProduct}>
            <select className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" value={selectedStoreId ?? ""} onChange={(event) => setSelectedStoreId(event.target.value)}>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
            <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Product title" value={productForm.title} onChange={(event) => setProductForm((current) => ({ ...current, title: event.target.value }))} required />
            <input className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Author" value={productForm.author} onChange={(event) => setProductForm((current) => ({ ...current, author: event.target.value }))} required />
            <textarea className="min-h-24 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Product description" value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Category</span>
                <select
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  value={productForm.category}
                  onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))}
                  required
                >
                  <option value="" disabled>
                    {isLoadingCategories ? "Loading categories..." : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Image URL</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  placeholder="Image URL"
                  value={productForm.imageUrl}
                  onChange={(event) => setProductForm((current) => ({ ...current, imageUrl: event.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Upload main image</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:file:bg-zinc-800 dark:file:text-zinc-200"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setProductForm((current) => ({ ...current, imageFile: file }));
                  }}
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Gallery images</span>
              <input
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:file:bg-zinc-800 dark:file:text-zinc-200"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = event.target.files ? Array.from(event.target.files) : [];
                  setProductForm((current) => ({ ...current, galleryFiles: files }));
                }}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Price (USD)</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  placeholder="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(event) => setProductForm((current) => ({ ...current, price: Number(event.target.value) }))}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Stock quantity</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  placeholder="Inventory"
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.inventory}
                  onChange={(event) => setProductForm((current) => ({ ...current, inventory: Number(event.target.value) }))}
                  required
                />
              </label>
            </div>
            <Button type="submit" className="w-full">Publish product</Button>
          </form>
        </div>
      </div>

      <div className="mt-8 rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Live inventory</p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">Products for {activeStore?.name ?? "your store"}</h2>
          </div>
          <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {ownerProducts.length} items
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ownerProducts.map((product) => (
            <div key={product.id} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">{product.category}</p>
                  <h3 className="mt-2 text-lg font-bold text-zinc-950 dark:text-white">{product.title}</h3>
                </div>
                <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  {product.status}
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{product.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span>${product.price}</span>
                <span>{product.inventory} in stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
