import type { Category, Order, Product, Review, Testimonial, UserProfile, VendorProfile } from "@/types/ecommerce";


import { apiFetch } from "@/lib/api/backend";
import { testimonials } from "@/data/mock";

type BackendReview = {
  id: string | number;
  user_name?: string;
  rating: number;
  title?: string;
  content?: string;
  helpful_count?: number;
  created_at?: string;
};

export type CatalogBookFilters = {
  category?: string;
  faculty?: string;
  vendor?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  featured?: boolean;
  in_stock?: boolean;
};

function normalizeProduct(b: any): Product {
  // Frontend Product type is based on the previous mock shape.
  // Map backend Book fields to the expected UI fields.
  const discountPercentage = b.discount_percentage;
  const price = Number(b.price);
  const discountPrice = b.discount_price !== null && b.discount_price !== undefined ? Number(b.discount_price) : null;

  return {
    id: Number(b.id) as unknown as number,
    slug: b.slug,
    title: b.title,
    author: b.author,
    price,
    rating: Number(b.rating ?? 0),
    reviewsCount: (b.reviews?.length ?? 0) as number,
    category: b.category?.slug ?? "",
    brand: b.vendor?.name ?? "",
    description: b.description,
    highlights: ["Curated by faculty", "Available for classroom and self-study"],
    images: (b.gallery_images?.map((img: any) => img.image).filter(Boolean) ?? []).length
      ? b.gallery_images!.map((img: any) => img.image).filter(Boolean)
      : b.image_url
      ? [b.image_url]
      : [],
    colors: ["Midnight"],
    sizes: ["M", "L"],
    inventory: Number(b.stock ?? 0),
    reviews: (b.reviews ?? []) as Review[],
    careInstructions: ["Keep dry", "Store securely"],
    vendorId: b.vendor?.id ?? null,
    vendorName: b.vendor?.name ?? "",
    vendorSlug: b.vendor?.slug ?? "",
    status: "active" as any,
    badge: b.is_featured ? "Featured" : undefined,
    compareAtPrice: discountPrice ? price : undefined,
    discountPrice: discountPrice ?? undefined,
    discount_percentage: discountPercentage,
    // Not all fields exist in backend; keep UI-compatible fallbacks.
    format: "Paperback",
    categories: b.category?.slug ? [b.category.slug] : [],
  } as Product;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiFetch<any[]>({ path: "/api/v1/categories/" });
    return res.map((c) => ({
      id: String(c.id),
      name: String(c.name),
      slug: String(c.slug),
      // frontend type expects icon + count; backend provides `image`.
      icon: typeof c.image === "string" ? c.image : "",
      description: String(c.description ?? ""),
      count: 0,
    })) as unknown as Category[];
  } catch (err) {
    // Fail gracefully when backend is unreachable (e.g., local dev backend not running).
    // Return an empty list so pages can render without crashing.
    // Keep a console error to aid debugging.
    // eslint-disable-next-line no-console
    console.error("Failed to fetch categories from backend:", err);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}


// Backend faculties endpoint exists, but the current frontend types
// do not model Faculty. Keep this function only if/when UI uses it.


export async function getVendors(): Promise<VendorProfile[]> {
  const res = await apiFetch<any[]>({ path: "/api/v1/vendors/" });
  return res.map((v) => ({
    id: String(v.id),
    userId: String(v.user ?? v.id),
    name: String(v.name),
    slug: String(v.slug),
    email: String(v.website ?? v.email ?? ""),
    bio: String(v.description ?? ""),
    specialties: v.description ? [String(v.description)] : [""],
    rating: Number(v.rating ?? 4.8),
    productsCount: Number(v.products_count ?? 0),
    status: String(v.is_active ? "active" : "inactive") as any,
    location: v.address ? String(v.address) : undefined,
  })) as unknown as VendorProfile[];
}

export async function getVendorBySlug(slug: string): Promise<VendorProfile> {
  const v = await apiFetch<any>({ path: `/api/v1/vendors/${encodeURIComponent(slug)}/` });
  return {
    id: String(v.id),
    userId: String(v.user ?? v.id),
    name: String(v.name),
    slug: String(v.slug),
    email: String(v.website ?? v.email ?? ""),
    bio: String(v.description ?? ""),
    specialties: v.description ? [String(v.description)] : [""],
    rating: Number(v.rating ?? 4.8),
    productsCount: Number(v.products_count ?? 0),
    status: String(v.is_active ? "active" : "inactive") as any,
    location: v.address ? String(v.address) : undefined,
  } as VendorProfile;
}

export async function getProductsForVendor(slug: string): Promise<Product[]> {
  const res = await apiFetch<any[]>({ path: "/api/v1/books/", query: { vendor: slug } });
  return res.map((b) => normalizeProduct(b));
}

export async function createVendor(data: {
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  email?: string;
  is_active?: boolean;
}, accessToken?: string | null): Promise<VendorProfile> {
  const res = await apiFetch<any>({
    path: "/api/v1/vendors/",
    method: "POST",
    body: data,
    accessToken,
  });

  return {
    id: String(res.id),
    userId: String(res.user ?? res.id),
    name: String(res.name),
    slug: String(res.slug),
    email: String(res.website ?? res.email ?? ""),
    bio: String(res.description ?? ""),
    specialties: res.description ? [String(res.description)] : [""],
    rating: Number(res.rating ?? 4.8),
    productsCount: Number(res.products_count ?? 0),
    status: String(res.is_active ? "active" : "inactive") as any,
    location: res.address ? String(res.address) : undefined,
  } as VendorProfile;
}

export async function createBook(data: {
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  imageFile?: File | null;
  galleryFiles?: File[];
  category?: string;
  discount_price?: number | null;
  isbn?: string;
  publisher?: string;
  publication_year?: number | null;
  pages?: number | null;
  language?: string;
  is_featured?: boolean;
}, accessToken?: string | null): Promise<Product> {
  let body: any = {
    title: data.title,
    author: data.author,
    description: data.description,
    price: data.price,
    stock: data.stock,
    discount_price: data.discount_price,
    isbn: data.isbn,
    publisher: data.publisher,
    publication_year: data.publication_year,
    pages: data.pages,
    language: data.language,
    is_featured: data.is_featured,
  };

  if (data.category) {
    const categoryId = Number(data.category);
    if (!Number.isNaN(categoryId)) {
      body.category_id = categoryId;
    } else {
      body.category_slug = data.category;
    }
  }

  if (data.imageFile || data.galleryFiles?.length) {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }

    if (data.galleryFiles?.length) {
      data.galleryFiles.forEach((file) => formData.append('gallery_images', file));
    }

    if (data.image_url) {
      formData.append('image_url', data.image_url);
    }

    body = formData;
  } else {
    if (data.image_url) {
      body.image_url = data.image_url;
    }
  }

  const res = await apiFetch<any>({
    path: "/api/v1/books/",
    method: "POST",
    body,
    accessToken,
  });

  return normalizeProduct(res);
}

export async function getProducts(filters: CatalogBookFilters = {}): Promise<Product[]> {
  try {
    const res = await apiFetch<any[]>({
      path: "/api/v1/books/",
      query: filters as any,
    });

    return res.map((b) => normalizeProduct(b));
  } catch (err) {
    // If the backend cannot be reached, log and return an empty product list.
    // eslint-disable-next-line no-console
    console.error("Failed to fetch products from backend:", err);
    return [];
  }
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const res = await getProducts({ featured: true });
  return res.slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!slug) {
    return undefined;
  }

  const res = await apiFetch<any>({ path: `/api/v1/books/${encodeURIComponent(slug)}/` });

  const reviewsRes = await apiFetch<any[]>({
    path: `/api/v1/books/${encodeURIComponent(slug)}/reviews/`,
  }).catch(() => []);

  const merged = {
    ...res,
    reviews: reviewsRes,
  };

  return normalizeProduct(merged);
}

function mapOrderResponse(order: any): Order {
  return {
    id: String(order.id),
    date: order.created_at ? new Date(order.created_at).toLocaleDateString() : order.order_number || '',
    status: order.status ?? 'pending',
    total: Number(order.total_price ?? 0),
    items: Array.isArray(order.items) ? order.items.length : 0,
    userId: order.user ? String(order.user) : undefined,
    orderNumber: String(order.order_number ?? order.id ?? ''),
    createdAt: order.created_at,
    itemsDetail: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          id: String(item.id),
          productId: Number(item.book?.id ?? item.book_id ?? 0),
          title: item.book?.title ?? item.book_title ?? '',
          quantity: Number(item.quantity ?? 0),
          unitPrice: Number(item.price ?? 0),
          subtotal: Number(item.price ?? 0) * Number(item.quantity ?? 0),
          vendorId: Number(item.book?.vendor?.id ?? 0),
          vendorName: item.book?.vendor?.name ?? '',
        }))
      : undefined,
    shippingAddress: order.shipping_address,
    paymentStatus: undefined,
  };
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const res = await getProducts({ category: categorySlug });
  return res;
}

export async function getOrders(accessToken?: string | null): Promise<Order[]> {
  if (!accessToken) return [];
  const res = await apiFetch<any[]>({ path: "/api/v1/orders/", accessToken });
  return res.map(mapOrderResponse);
}

export async function getOrdersForUser(accessToken: string | null): Promise<Order[]> {
  return getOrders(accessToken);
}

export async function createOrder(accessToken: string, orderData: {
  shipping_address: string;
  phone: string;
  email?: string;
  billing_address?: string;
  notes?: string;
  items: Array<{ book_id: number; quantity: number }>;
}): Promise<Order> {
  const res = await apiFetch<any>({
    path: "/api/v1/orders/",
    method: "POST",
    body: orderData,
    accessToken,
  });

  return mapOrderResponse(res);
}

export async function getUserProfile(accessToken: string): Promise<UserProfile> {
  const res = await apiFetch<any>({ path: "/api/v1/auth/me/", accessToken });
  // Best-effort mapping for UI type.
  return {
    id: String(res.id),
    name: typeof res.name === 'string' ? res.name : `${res.first_name ?? ''} ${res.last_name ?? ''}`.trim() || res.email?.split('@')[0] || '',
    email: String(res.email ?? ''),
    plan: typeof res.plan === 'string' ? res.plan : 'Student',
    joined: typeof res.created_at === 'string' ? res.created_at : new Date().toISOString().slice(0, 10),
    role: res.role === 'professor' || res.role === 'vendor' ? 'vendor' : res.role === 'admin' ? 'admin' : 'customer',
    avatarUrl: typeof res.avatarUrl === 'string' ? res.avatarUrl : undefined,
  };
}

