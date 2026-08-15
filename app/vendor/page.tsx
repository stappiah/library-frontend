"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Store,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

import {
  createBook,
  createVendor,
  getCategories,
  getProductsForVendor,
  getUserVendor,
  getFaculties,
} from "@/lib/services/catalog-service";

import { useAppSelector } from "@/store/hooks";
import { selectAccessToken } from "@/store/slices/authSlice";

import type {
  Category,
  Product,
  ProductType,
  VendorProfile,
} from "@/types/ecommerce";

interface StoreFormState {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

interface ProductFormState {
  title: string;
  author: string;
  description: string;

  category: string;
  faculty: string;

  productType: ProductType;

  price: number | null;
  discountPrice: number | null;

  isbn: string;
  publisher: string;
  publicationYear: number | null;
  pages: number | null;
  language: string;

  imageFile: File | null;
  galleryFiles: File[];

  digitalFile: File | null;

  downloadLimit: number;
  downloadExpiryDays: number;

  isFeatured: boolean;
}

const productDefaults: ProductFormState = {
  title: "",
  author: "",
  description: "",

  category: "",
  faculty: "",

  productType: "ebook",

  price: null,
  discountPrice: null,

  isbn: "",
  publisher: "",
  publicationYear: null,
  pages: null,
  language: "English",

  imageFile: null,
  galleryFiles: [],

  digitalFile: null,

  downloadLimit: 5,
  downloadExpiryDays: 30,

  isFeatured: false,
};

const storeDefaults: StoreFormState = {
  name: "",
  description: "",
  email: "",
  phone: "",
  address: "",
};

const inputClass =
  "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-600 dark:focus:ring-zinc-800";

const labelClass =
  "mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200";

export default function VendorPortalPage() {
  const [stores, setStores] = useState<VendorProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [faculties, setFaculties] = useState<
    { id: number | string; name: string; slug: string }[]
  >([]);

  const [selectedStoreId, setSelectedStoreId] = useState<
    number | string | null
  >(null);

  const [storeForm, setStoreForm] = useState<StoreFormState>(storeDefaults);

  const [productForm, setProductForm] =
    useState<ProductFormState>(productDefaults);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSnack, setshowSnack] = useState(false);

  const accessToken = useAppSelector(selectAccessToken);

  const showSuccess = (text: string) => {
    setMessage(null);
    setError(null);
    setSuccessMessage(text);
    setshowSnack(true);

    window.setTimeout(() => {
      setshowSnack(false);
      setSuccessMessage(null);
    }, 5000);
  };

  useEffect(() => {
    setIsLoadingStores(true);

    getUserVendor()
      .then((vendor) => {
        const vendorList = vendor ? [vendor] : [];
        setStores(vendorList);
        setSelectedStoreId(vendor?.id ?? null);
      })
      .catch(() => {
        setStores([]);
      })
      .finally(() => {
        setIsLoadingStores(false);
      });
  }, []);

  useEffect(() => {
    setIsLoadingCategories(true);

    getCategories()
      .then((categoryList) => {
        setCategories(categoryList);
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    setIsLoadingFaculties(true);

    getFaculties()
      .then((facultyList) => {
        setFaculties(facultyList);
      })
      .catch(() => {
        setFaculties([]);
      })
      .finally(() => {
        setIsLoadingFaculties(false);
      });
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

    if (!accessToken) {
      setError("Please sign in before creating a storefront.");
      return;
    }

    setIsCreatingStore(true);

    try {
      const vendor = await createVendor(
        {
          name: storeForm.name,
          description: storeForm.description,
          email: storeForm.email,
          phone: storeForm.phone,
          address: storeForm.address,
          is_active: true,
        },
        accessToken,
      );

      setStores((current) => [vendor, ...current]);
      setSelectedStoreId(vendor.id);

      setStoreForm(storeDefaults);

      setMessage("Storefront created successfully.");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to create storefront. Please check your details and try again.",
      );
    } finally {
      setIsCreatingStore(false);
    }
  };

  const handleAddProduct = async (event: FormEvent) => {
    event.preventDefault();

    setError(null);
    setMessage(null);

    if (!accessToken) {
      setError("Please sign in before publishing an ebook.");
      return;
    }

    if (!activeStore) {
      setError("Please create or select a storefront first.");
      return;
    }

    if (!productForm.digitalFile) {
      setError("Please upload the ebook file.");
      return;
    }

    if (productForm.price === null) {
      setError("Please enter a price.");
      return;
    }

    if (productForm.price < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (
      productForm.discountPrice !== null &&
      productForm.discountPrice >= productForm.price
    ) {
      setError("Discount price must be lower than the original price.");
      return;
    }

    setIsPublishing(true);

    try {
      const book = await createBook(
        {
          title: productForm.title.trim(),
          author: productForm.author.trim(),
          description: productForm.description.trim(),

          category: productForm.category || undefined,
          faculty: productForm.faculty || undefined,

          product_type: productForm.productType,

          price: productForm.price,
          discount_price: productForm.discountPrice || undefined,

          isbn: productForm.isbn.trim() || undefined,
          publisher: productForm.publisher.trim() || undefined,

          publication_year: productForm.publicationYear || undefined,

          pages: productForm.pages || undefined,

          language: productForm.language.trim() || "English",

          imageFile: productForm.imageFile || undefined,

          galleryFiles: productForm.galleryFiles,

          digitalFile: productForm.digitalFile,

          download_limit: productForm.downloadLimit,

          download_expiry_days: productForm.downloadExpiryDays,

          is_featured: productForm.isFeatured,
        },
        accessToken,
      );

      setProducts((current) => [book, ...current]);

      setProductForm(productDefaults);

      showSuccess("Your ebook has been published successfully.");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to publish the ebook. Please check the file and form details.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const ownerProducts = useMemo(
    () =>
      products.filter((product) => product.vendor?.slug === activeStore?.slug),
    [activeStore?.slug, products],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      {/* Header */}
      <Snackbar
        open={showSnack}
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => setshowSnack(false)}
      >
        <SnackbarContent
          message={successMessage || "Success!"}
          sx={{
            backgroundColor: "#16a34a",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "12px",
          }}
        />
      </Snackbar>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Vendor portal
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            Publish and sell your digital books.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Create your bookstore, upload ebooks, set your pricing, and give
            customers secure access to their purchases.
          </p>
        </div>

        <Link
          href="/vendors"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
        >
          Explore bookstores
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Messages */}
      {(message || error) && (
        <div className="mt-6">
          {message && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* CREATE STORE */}
        <div className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-zinc-100 p-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Store className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                Your bookstore
              </h2>

              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Set up the storefront customers will see.
              </p>
            </div>
          </div>

          {stores.length > 0 ? (
            <div className="mt-6 space-y-4">
              {stores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedStoreId === store.id
                      ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800"
                      : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"
                  }`}
                >
                  <p className="font-bold text-zinc-950 dark:text-white">
                    {store.name}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">{store.email}</p>
                </button>
              ))}
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleCreateStore}>
              <div>
                <label className={labelClass}>Store name</label>

                <input
                  className={inputClass}
                  placeholder="e.g. Steve's Digital Library"
                  value={storeForm.name}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Store description</label>

                <textarea
                  className={`${inputClass} min-h-28`}
                  placeholder="Tell readers what kind of books you publish."
                  value={storeForm.description}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Contact email</label>

                <input
                  className={inputClass}
                  type="email"
                  placeholder="you@example.com"
                  value={storeForm.email}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone</label>

                  <input
                    className={inputClass}
                    placeholder="+233..."
                    value={storeForm.phone}
                    onChange={(event) =>
                      setStoreForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Address</label>

                  <input
                    className={inputClass}
                    placeholder="Location"
                    value={storeForm.address}
                    onChange={(event) =>
                      setStoreForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isCreatingStore}
              >
                {isCreatingStore ? "Creating bookstore..." : "Create bookstore"}
              </Button>
            </form>
          )}
        </div>

        {/* EBOOK FORM */}
        <div className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-zinc-100 p-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <BookOpen className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                Publish an ebook
              </h2>

              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Upload your digital book and provide its details.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleAddProduct}>
            {/* Store */}
            <div>
              <label className={labelClass}>Publish to bookstore</label>

              <select
                className={inputClass}
                value={selectedStoreId ?? ""}
                onChange={(event) =>
                  setSelectedStoreId(Number(event.target.value))
                }
                disabled={stores.length === 0}
                required
              >
                <option value="">
                  {isLoadingStores
                    ? "Loading bookstores..."
                    : "Select bookstore"}
                </option>

                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Basic information */}
            <div className="rounded-3xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="mb-4">
                <h3 className="font-bold text-zinc-950 dark:text-white">
                  Book information
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Information customers will use to discover your ebook.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Book title</label>

                  <input
                    className={inputClass}
                    placeholder="e.g. Introduction to Computer Science"
                    value={productForm.title}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Author</label>

                    <input
                      className={inputClass}
                      placeholder="Author name"
                      value={productForm.author}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          author: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Product type</label>

                    <select
                      className={inputClass}
                      value={productForm.productType}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          productType: event.target.value as ProductType,
                        }))
                      }
                    >
                      <option value="ebook">Ebook</option>

                      <option value="notes">Lecture Notes</option>

                      <option value="template">Template</option>

                      <option value="software">Software</option>

                      <option value="course">Course Material</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>

                  <textarea
                    className={`${inputClass} min-h-32`}
                    placeholder="Describe what readers will learn or get from this ebook."
                    value={productForm.description}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Category</label>

                    <select
                      className={inputClass}
                      value={productForm.category}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" disabled>
                        {isLoadingCategories
                          ? "Loading categories..."
                          : "Select category"}
                      </option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Faculty / Department</label>

                    <select
                      className={inputClass}
                      value={productForm.faculty}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          faculty: event.target.value,
                        }))
                      }
                    >
                      <option value="">
                        {isLoadingFaculties
                          ? "Loading faculties..."
                          : "Select faculty (optional)"}
                      </option>

                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.slug}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Publication details */}
            <div className="rounded-3xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="mb-4">
                <h3 className="font-bold text-zinc-950 dark:text-white">
                  Publication details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* <div>
                  <label className={labelClass}>
                    ISBN
                  </label>

                  <input
                    className={inputClass}
                    placeholder="978..."
                    value={productForm.isbn}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        isbn: event.target.value,
                      }))
                    }
                  />
                </div> */}

                <div>
                  <label className={labelClass}>Publisher</label>

                  <input
                    className={inputClass}
                    placeholder="Publisher name"
                    value={productForm.publisher}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        publisher: event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Publication year</label>

                  <input
                    className={inputClass}
                    type="number"
                    min="1000"
                    max={new Date().getFullYear() + 1}
                    placeholder="2026"
                    value={productForm.publicationYear ?? ""}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        publicationYear: event.target.value
                          ? Number(event.target.value)
                          : null,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Number of pages</label>

                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    placeholder="250"
                    value={productForm.pages ?? ""}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        pages: event.target.value
                          ? Number(event.target.value)
                          : null,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Language</label>

                  <input
                    className={inputClass}
                    placeholder="English"
                    value={productForm.language}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        language: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ebook upload */}
            <div className="rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-950">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-zinc-900 p-3 text-white dark:bg-white dark:text-zinc-900">
                  <FileText className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-bold text-zinc-950 dark:text-white">
                    Ebook file
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Upload the actual digital book customers will download after
                    purchasing.
                  </p>
                </div>
              </div>

              <input
                className="mt-5 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:file:bg-white dark:file:text-zinc-900"
                type="file"
                accept=".pdf,.epub,.mobi,.azw,.azw3"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  setProductForm((current) => ({
                    ...current,
                    digitalFile: file,
                  }));
                }}
                required
              />

              {productForm.digitalFile && (
                <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <strong>Selected:</strong> {productForm.digitalFile.name}
                  {" · "}
                  {(productForm.digitalFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}

              <p className="mt-3 text-xs text-zinc-500">
                Recommended formats: PDF or EPUB.
              </p>
            </div>

            {/* Cover & gallery */}
            <div className="rounded-3xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="mb-4 flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-zinc-500" />

                <div>
                  <h3 className="font-bold text-zinc-950 dark:text-white">
                    Book artwork
                  </h3>

                  <p className="text-xs text-zinc-500">
                    Add a cover image and optional gallery images.
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Book cover</label>

                <input
                  className={inputClass}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;

                    setProductForm((current) => ({
                      ...current,
                      imageFile: file,
                    }));
                  }}
                />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Additional images</label>

                <input
                  className={inputClass}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) => {
                    const files = event.target.files
                      ? Array.from(event.target.files)
                      : [];

                    setProductForm((current) => ({
                      ...current,
                      galleryFiles: files,
                    }));
                  }}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-3xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="mb-4">
                <h3 className="font-bold text-zinc-950 dark:text-white">
                  Pricing
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Original price</label>

                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={productForm.price ?? ""}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        price: Number(event.target.value),
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Discount price</label>

                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    value={productForm.discountPrice ?? ""}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        discountPrice: event.target.value
                          ? Number(event.target.value)
                          : null,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Download settings */}
            <div className="rounded-3xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="mb-4">
                <h3 className="font-bold text-zinc-950 dark:text-white">
                  Download settings
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Control how customers access purchased ebooks.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Maximum downloads</label>

                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.downloadLimit}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        downloadLimit: Number(event.target.value),
                      }))
                    }
                  />

                  <p className="mt-1 text-xs text-zinc-500">
                    Use 0 for unlimited downloads.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Download expiry (days)</label>

                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    step="1"
                    value={productForm.downloadExpiryDays}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        downloadExpiryDays: Number(event.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      isFeatured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-zinc-300"
                />

                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Submit this ebook as a featured book
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isPublishing || !activeStore || !productForm.digitalFile
              }
            >
              <UploadCloud className="mr-2 h-4 w-4" />

              {isPublishing ? "Publishing ebook..." : "Publish ebook"}
            </Button>
          </form>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mt-8 rounded-4xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Published ebooks
            </p>

            <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">
              {activeStore?.name ?? "Your bookstore"}
            </h2>
          </div>

          <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {ownerProducts.length} books
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="mt-6 rounded-2xl bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:bg-zinc-950">
            Loading your ebooks...
          </div>
        ) : ownerProducts.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <BookOpen className="mx-auto h-8 w-8 text-zinc-400" />

            <p className="mt-3 font-semibold text-zinc-900 dark:text-white">
              No ebooks published yet
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Upload your first ebook using the form above.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ownerProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {product.category?.name ?? "Uncategorized"}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-zinc-950 dark:text-white">
                      {product.title}
                    </h3>
                  </div>

                  <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    {product.isFeatured ? "Featured" : "Published"}
                  </div>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>
                    {product.discountPrice != null
                      ? `$${product.discountPrice}`
                      : `$${product.price}`}
                  </span>

                  <span>
                    {product.fileName ? "Digital file ready" : "Preview only"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
