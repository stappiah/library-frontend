import type {
  Category,
  Download,
  Faculty,
  Order,
  OrderItem,
  Product,
  ProductImage,
  Review,
  Testimonial,
  UserProfile,
  VendorProfile,
  ProductType,
} from "@/types/ecommerce";

import { apiFetch } from "@/lib/api/backend";
import { testimonials } from "@/data/mock";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type BackendReview = {
  id: string | number;
  user?: string | number | null;
  user_name?: string;
  rating?: number;
  title?: string;
  content?: string;
  helpful_count?: number;
  created_at?: string;
};

type BackendBookImage = {
  id: string | number;
  image?: string | null;
  alt_text?: string;
};

type BackendCategory = {
  id: string | number;
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
};

type BackendFaculty = {
  id: string | number;
  name?: string;
  slug?: string;
  description?: string | null;
};

type BackendVendor = {
  id: string | number;
  user?: string | number | null;
  name?: string;
  slug?: string;
  description?: string | null;
  email?: string | null;
  logo?: string | null;
  phone?: string | null;
  address?: string | null;
  rating?: number;
  products_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type BackendBook = {
  id: string | number;
  title?: string;
  slug?: string;
  author?: string;
  description?: string;

  price?: string | number;
  discount_price?: string | number | null;
  discount_percentage?: number;

  product_type?: ProductType;

  category?: BackendCategory | null;
  faculty?: BackendFaculty | null;
  vendor?: BackendVendor | null;

  isbn?: string | null;
  publisher?: string | null;
  publication_year?: number | null;
  pages?: number | null;
  language?: string;

  image?: string | null;
  image_url?: string | null;

  gallery_images?: BackendBookImage[];

  rating?: number;
  is_featured?: boolean;

  file_name?: string | null;
  file_size?: number | null;

  download_limit?: number;
  download_expiry_days?: number;

  reviews?: BackendReview[];

  created_at?: string;
  updated_at?: string;
};

type BackendOrderItem = {
  id: string | number;
  book?: BackendBook | null;
  book_id?: string | number;
  quantity?: number;
  price?: string | number;
  discount_price?: string | number | null;
  line_total?: string | number;
};

type BackendOrder = {
  id: string | number;
  order_number?: string;
  user?: string | number;
  total_price?: string | number;
  status?: string;
  email?: string;
  notes?: string | null;
  items?: BackendOrderItem[];
  created_at?: string;
  updated_at?: string;
};

export type CatalogBookFilters = {
  category?: string;
  faculty?: string;
  vendor?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  featured?: boolean;
  type?: ProductType;
  product_type?: ProductType;
  has_file?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

function toNumber(value: unknown, fallback = 0): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function toOptionalNumber(
  value: unknown,
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function toStringValue(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string" ? value : fallback;
}

/* -------------------------------------------------------------------------- */
/* Review normalization                                                       */
/* -------------------------------------------------------------------------- */

function normalizeReview(
  review: BackendReview,
): Review {
  return {
    id: toNumber(review.id),
    user:
      review.user !== undefined && review.user !== null
        ? toNumber(review.user)
        : null,

    userName: toStringValue(
      review.user_name,
      "Anonymous",
    ),

    rating: toNumber(review.rating),
    title: toStringValue(review.title),
    content: toStringValue(review.content),

    helpfulCount: toNumber(
      review.helpful_count,
    ),

    createdAt: toStringValue(
      review.created_at,
    ),
  };
}

/* -------------------------------------------------------------------------- */
/* Category normalization                                                     */
/* -------------------------------------------------------------------------- */

function normalizeCategory(
  category?: BackendCategory | null,
): Category | null {
  if (!category) {
    return null;
  }

  return {
    id: toNumber(category.id),
    name: toStringValue(category.name),
    slug: toStringValue(category.slug),
    description: toStringValue(category.description),
    image: category.image ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/* Faculty normalization                                                      */
/* -------------------------------------------------------------------------- */

function normalizeFaculty(
  faculty?: BackendFaculty | null,
): Faculty | null {
  if (!faculty) {
    return null;
  }

  return {
    id: toNumber(faculty.id),
    name: toStringValue(faculty.name),
    slug: toStringValue(faculty.slug),
    description: toStringValue(faculty.description),
  };
}

/* -------------------------------------------------------------------------- */
/* Vendor normalization                                                       */
/* -------------------------------------------------------------------------- */

function normalizeVendor(
  vendor?: BackendVendor | null,
): VendorProfile | null {
  if (!vendor) {
    return null;
  }

  return {
    id: toNumber(vendor.id),

    userId:
      vendor.user !== undefined &&
      vendor.user !== null
        ? toNumber(vendor.user)
        : undefined,

    name: toStringValue(vendor.name),
    slug: toStringValue(vendor.slug),

    email: toStringValue(vendor.email),

    description: toStringValue(
      vendor.description,
    ),

    logo: vendor.logo ?? null,
    phone: vendor.phone ?? null,
    address: vendor.address ?? null,

    rating: toNumber(vendor.rating),
    productsCount: toNumber(
      vendor.products_count,
    ),

    status: vendor.is_active
      ? "active"
      : "suspended",

    isActive: Boolean(vendor.is_active),

    createdAt: vendor.created_at,
    updatedAt: vendor.updated_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Product normalization                                                      */
/* -------------------------------------------------------------------------- */

function normalizeProduct(
  book: BackendBook,
): Product {
  const price = toNumber(book.price);

  const discountPrice =
    toOptionalNumber(book.discount_price);

  const galleryImages: ProductImage[] =
    (book.gallery_images ?? [])
      .filter((image) => Boolean(image.image))
      .map((image) => ({
        id: toNumber(image.id),
        image: image.image as string,
        altText: image.alt_text ?? "",
      }));

  const galleryUrls = galleryImages.map(
    (image) => image.image,
  );

  const primaryImage =
    book.image_url ??
    book.image ??
    galleryUrls[0] ??
    null;

  const reviews = (book.reviews ?? []).map(
    normalizeReview,
  );

  return {
    id: toNumber(book.id),

    slug: toStringValue(book.slug),

    title: toStringValue(book.title),
    author: toStringValue(book.author),
    description: toStringValue(book.description),

    price,

    discountPrice,

    discountPercentage: toNumber(
      book.discount_percentage,
    ),

    productType:
      book.product_type ?? "ebook",

    category: normalizeCategory(
      book.category,
    ),

    faculty: normalizeFaculty(
      book.faculty,
    ),

    vendor: normalizeVendor(
      book.vendor,
    ),

    isbn: book.isbn ?? null,
    publisher: book.publisher ?? null,

    publicationYear:
      book.publication_year ?? null,

    pages: book.pages ?? null,

    language:
      toStringValue(
        book.language,
        "English",
      ),

    image: book.image ?? null,
    imageUrl: book.image_url ?? null,

    images: primaryImage
      ? [
          primaryImage,
          ...galleryUrls.filter(
            (url) => url !== primaryImage,
          ),
        ]
      : galleryUrls,

    galleryImages,

    rating: toNumber(book.rating),

    reviewsCount: reviews.length,

    reviews,

    isFeatured: Boolean(
      book.is_featured,
    ),

    fileName: book.file_name ?? null,
    fileSize: book.file_size ?? null,

    downloadLimit: toNumber(
      book.download_limit,
      5,
    ),

    downloadExpiryDays: toNumber(
      book.download_expiry_days,
      30,
    ),

    createdAt: book.created_at,
    updatedAt: book.updated_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  try {
    const response =
      await apiFetch<BackendCategory[]>({
        path: "/api/v1/categories/",
      });

    return response.map(
      normalizeCategory,
    ).filter(
      (category): category is Category =>
        category !== null,
    );
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error,
    );

    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Faculties                                                                  */
/* -------------------------------------------------------------------------- */

export async function getFaculties(): Promise<Faculty[]> {
  try {
    const response =
      await apiFetch<BackendFaculty[]>({
        path: "/api/v1/faculties/",
      });

    return response.map(
      normalizeFaculty,
    ).filter(
      (faculty): faculty is Faculty =>
        faculty !== null,
    );
  } catch (error) {
    console.error(
      "Failed to fetch faculties:",
      error,
    );

    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

/* -------------------------------------------------------------------------- */
/* Vendors                                                                    */
/* -------------------------------------------------------------------------- */

export async function getVendors(): Promise<VendorProfile[]> {
  try {
    const response =
      await apiFetch<BackendVendor[]>({
        path: "/api/v1/vendors/",
      });

    return response.map(
      normalizeVendor,
    ).filter(
      (vendor): vendor is VendorProfile =>
        vendor !== null,
    );
  } catch (error) {
    console.error(
      "Failed to fetch vendors:",
      error,
    );

    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Current user's vendor/shop                                                 */
/* -------------------------------------------------------------------------- */

export async function getUserVendor(): Promise<
  VendorProfile | null
> {
  try {
    const response =
      await apiFetch<BackendVendor>({
        path: "/api/v1/user-shop/",
      });

    return normalizeVendor(response);
  } catch (error) {
    console.error(
      "Failed to fetch current user vendor:",
      error,
    );

    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Vendor by slug                                                             */
/* -------------------------------------------------------------------------- */

export async function getVendorBySlug(
  slug: string,
): Promise<VendorProfile> {
  if (!slug) {
    throw new Error(
      "Vendor slug is required",
    );
  }

  const response =
    await apiFetch<BackendVendor>({
      path: `/api/v1/vendors/${encodeURIComponent(slug)}/`,
    });

  const vendor =
    normalizeVendor(response);

  if (!vendor) {
    throw new Error(
      "Vendor not found",
    );
  }

  return vendor;
}

/* -------------------------------------------------------------------------- */
/* Vendor products                                                            */
/* -------------------------------------------------------------------------- */

export async function getProductsForVendor(
  slug: string,
): Promise<Product[]> {
  const response =
    await apiFetch<BackendBook[]>({
      path: "/api/v1/books/",
      query: {
        vendor: slug,
      },
    });

  return response.map(
    normalizeProduct,
  );
}

/* -------------------------------------------------------------------------- */
/* Create vendor                                                              */
/* -------------------------------------------------------------------------- */

export interface CreateVendorData {
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  email?: string;
  is_active?: boolean;
}

export async function createVendor(
  data: CreateVendorData,
  accessToken?: string | null,
): Promise<VendorProfile> {
  const response =
    await apiFetch<BackendVendor>({
      path: "/api/v1/vendors/",
      method: "POST",
      body: data,
      accessToken,
    });

  const vendor =
    normalizeVendor(response);

  if (!vendor) {
    throw new Error(
      "Failed to create vendor",
    );
  }

  return vendor;
}

/* -------------------------------------------------------------------------- */
/* Create book                                                                */
/* -------------------------------------------------------------------------- */

export interface CreateBookData {
  title: string;
  author: string;
  description: string;
  price: number;

  product_type?: ProductType;

  category?: string;
  faculty?: string;

  discount_price?: number | null;

  isbn?: string;
  publisher?: string;
  publication_year?: number | null;
  pages?: number | null;
  language?: string;

  image_url?: string;

  imageFile?: File | null;
  galleryFiles?: File[];
  digitalFile?: File | null;

  is_featured?: boolean;

  download_limit?: number;
  download_expiry_days?: number;
}

function appendIfDefined(
  formData: FormData,
  key: string,
  value: unknown,
) {
  if (
    value !== undefined &&
    value !== null &&
    value !== ""
  ) {
    formData.append(
      key,
      String(value),
    );
  }
}

export async function createBook(
  data: CreateBookData,
  accessToken?: string | null,
): Promise<Product> {
  const hasFiles =
    Boolean(data.imageFile) ||
    Boolean(data.galleryFiles?.length) ||
    Boolean(data.digitalFile);

  /*
   * IMPORTANT:
   *
   * Your Django serializer expects:
   *
   * category_id / category_slug
   * faculty_id / faculty_slug
   *
   * It does NOT expect:
   *
   * category
   * faculty
   */

  if (hasFiles) {
    const formData = new FormData();

    appendIfDefined(
      formData,
      "title",
      data.title,
    );

    appendIfDefined(
      formData,
      "author",
      data.author,
    );

    appendIfDefined(
      formData,
      "description",
      data.description,
    );

    appendIfDefined(
      formData,
      "price",
      data.price,
    );

    appendIfDefined(
      formData,
      "product_type",
      data.product_type ?? "ebook",
    );

    appendIfDefined(
      formData,
      "discount_price",
      data.discount_price,
    );

    appendIfDefined(
      formData,
      "isbn",
      data.isbn,
    );

    appendIfDefined(
      formData,
      "publisher",
      data.publisher,
    );

    appendIfDefined(
      formData,
      "publication_year",
      data.publication_year,
    );

    appendIfDefined(
      formData,
      "pages",
      data.pages,
    );

    appendIfDefined(
      formData,
      "language",
      data.language ?? "English",
    );

    appendIfDefined(
      formData,
      "is_featured",
      data.is_featured,
    );

    appendIfDefined(
      formData,
      "download_limit",
      data.download_limit,
    );

    appendIfDefined(
      formData,
      "download_expiry_days",
      data.download_expiry_days,
    );

    /*
     * Category can be either:
     *
     * "5"
     * or
     * "fiction"
     */
    if (data.category) {
      const categoryId =
        Number(data.category);

      if (
        Number.isInteger(categoryId) &&
        categoryId > 0
      ) {
        appendIfDefined(
          formData,
          "category_id",
          categoryId,
        );
      } else {
        appendIfDefined(
          formData,
          "category_slug",
          data.category,
        );
      }
    }

    /*
     * Faculty can be either:
     *
     * "3"
     * or
     * "computer-science"
     */
    if (data.faculty) {
      const facultyId =
        Number(data.faculty);

      if (
        Number.isInteger(facultyId) &&
        facultyId > 0
      ) {
        appendIfDefined(
          formData,
          "faculty_id",
          facultyId,
        );
      } else {
        appendIfDefined(
          formData,
          "faculty_slug",
          data.faculty,
        );
      }
    }

    if (data.image_url) {
      formData.append(
        "image_url",
        data.image_url,
      );
    }

    if (data.imageFile) {
      formData.append(
        "image",
        data.imageFile,
      );
    }

    if (data.digitalFile) {
      formData.append(
        "digital_file",
        data.digitalFile,
      );
    }

    for (
      const file of data.galleryFiles ?? []
    ) {
      formData.append(
        "gallery_images",
        file,
      );
    }

    const response =
      await apiFetch<BackendBook>({
        path: "/api/v1/books/",
        method: "POST",
        body: formData,
        accessToken,
      });

    return normalizeProduct(
      response,
    );
  }

  /*
   * JSON request when there are no files.
   */
  const body: Record<
    string,
    unknown
  > = {
    title: data.title,
    author: data.author,
    description: data.description,
    price: data.price,

    product_type:
      data.product_type ?? "ebook",

    discount_price:
      data.discount_price ?? null,

    isbn: data.isbn,
    publisher: data.publisher,

    publication_year:
      data.publication_year ?? null,

    pages:
      data.pages ?? null,

    language:
      data.language ?? "English",

    image_url:
      data.image_url,

    is_featured:
      data.is_featured ?? false,

    download_limit:
      data.download_limit,

    download_expiry_days:
      data.download_expiry_days,
  };

  if (data.category) {
    const categoryId =
      Number(data.category);

    if (
      Number.isInteger(categoryId) &&
      categoryId > 0
    ) {
      body.category_id = categoryId;
    } else {
      body.category_slug =
        data.category;
    }
  }

  if (data.faculty) {
    const facultyId =
      Number(data.faculty);

    if (
      Number.isInteger(facultyId) &&
      facultyId > 0
    ) {
      body.faculty_id = facultyId;
    } else {
      body.faculty_slug =
        data.faculty;
    }
  }

  const response =
    await apiFetch<BackendBook>({
      path: "/api/v1/books/",
      method: "POST",
      body,
      accessToken,
    });

  return normalizeProduct(
    response,
  );
}

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

export async function getProducts(
  filters: CatalogBookFilters = {},
): Promise<Product[]> {
  try {
    const response =
      await apiFetch<BackendBook[]>({
        path: "/api/v1/books/",
        query: filters,
      });

    return response.map(
      normalizeProduct,
    );
  } catch (error) {
    console.error(
      "Failed to fetch products:",
      error,
    );

    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Featured products                                                          */
/* -------------------------------------------------------------------------- */

export async function getFeaturedProducts(
  limit = 3,
): Promise<Product[]> {
  const products =
    await getProducts({
      featured: true,
    });

  return products.slice(
    0,
    limit,
  );
}

/* -------------------------------------------------------------------------- */
/* Product by slug                                                            */
/* -------------------------------------------------------------------------- */

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  if (!slug) {
    return undefined;
  }

  try {
    const response =
      await apiFetch<BackendBook>({
        path: `/api/v1/books/${encodeURIComponent(slug)}/`,
      });

    /*
     * Detail serializer already contains reviews,
     * but we also call the explicit reviews endpoint
     * to make sure we have the latest reviews.
     */
    const reviews =
      await apiFetch<BackendReview[]>({
        path: `/api/v1/books/${encodeURIComponent(slug)}/reviews/`,
      }).catch(() => []);

    return normalizeProduct({
      ...response,
      reviews,
    });
  } catch (error) {
    console.error(
      "Failed to fetch product:",
      error,
    );

    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/* Products by category                                                       */
/* -------------------------------------------------------------------------- */

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  if (!categorySlug) {
    return [];
  }

  return getProducts({
    category: categorySlug,
  });
}

/* -------------------------------------------------------------------------- */
/* Orders                                                                     */
/* -------------------------------------------------------------------------- */

function normalizeOrderItem(
  item: BackendOrderItem,
): OrderItem {
  const price =
    toNumber(item.price);

  const discountPrice =
    toOptionalNumber(
      item.discount_price,
    );

  const quantity =
    toNumber(item.quantity, 1);

  const unitPrice =
    discountPrice ?? price;

  return {
    id: toNumber(item.id),

    productId: toNumber(
      item.book?.id ??
        item.book_id,
    ),

    title:
      item.book?.title ??
      "",

    quantity,

    unitPrice: price,

    discountPrice,

    subtotal:
      toNumber(
        item.line_total,
        unitPrice * quantity,
      ),

    vendorId:
      item.book?.vendor?.id !== undefined
        ? toNumber(
            item.book.vendor.id,
          )
        : undefined,

    vendorName:
      item.book?.vendor?.name,
  };
}

function normalizeOrder(
  order: BackendOrder,
): Order {
  const items =
    Array.isArray(order.items)
      ? order.items.map(
          normalizeOrderItem,
        )
      : [];

  return {
    id: String(order.id),

    date: order.created_at
      ? new Date(
          order.created_at,
        ).toLocaleDateString()
      : "",

    status:
      normalizeOrderStatus(
        order.status,
      ),

    total: toNumber(
      order.total_price,
    ),

    items: items.length,

    userId:
      order.user !== undefined
        ? String(order.user)
        : undefined,

    orderNumber:
      String(
        order.order_number ??
          order.id,
      ),

    createdAt:
      order.created_at,

    updatedAt:
      order.updated_at,

    itemsDetail:
      items,

    email:
      order.email,

    notes:
      order.notes ?? undefined,
  };
}

function normalizeOrderStatus(
  status?: string,
): Order["status"] {
  switch (status) {
    case "paid":
      return "paid";

    case "failed":
      return "failed";

    case "cancelled":
      return "cancelled";

    case "refunded":
      return "refunded";

    case "pending":
    default:
      return "pending";
  }
}

/* -------------------------------------------------------------------------- */
/* Get orders                                                                 */
/* -------------------------------------------------------------------------- */

export async function getOrders(
  accessToken?: string | null,
): Promise<Order[]> {
  if (!accessToken) {
    return [];
  }

  try {
    const response =
      await apiFetch<BackendOrder[]>({
        path: "/api/v1/orders/",
        accessToken,
      });

    return response.map(
      normalizeOrder,
    );
  } catch (error) {
    console.error(
      "Failed to fetch orders:",
      error,
    );

    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Orders for current user                                                    */
/* -------------------------------------------------------------------------- */

export async function getOrdersForUser(
  accessToken: string | null,
): Promise<Order[]> {
  return getOrders(
    accessToken,
  );
}

/* -------------------------------------------------------------------------- */
/* Create order                                                               */
/* -------------------------------------------------------------------------- */

export interface CreateOrderData {
  email?: string;
  notes?: string;
  phone?: string;
  shipping_address?: string;
  billing_address?: string;

  items: Array<{
    book_id: number | string;
    quantity: number;
  }>;
}

export async function createOrder(
  accessToken: string,
  orderData: CreateOrderData,
): Promise<Order> {
  const normalizedItems = orderData.items.map((item) => {
    const numericBookId = typeof item.book_id === "number" ? item.book_id : Number(item.book_id);

    return {
      ...item,
      book_id: Number.isFinite(numericBookId) ? numericBookId : 0,
      quantity: Number(item.quantity) || 0,
    };
  });

  const response =
    await apiFetch<BackendOrder>({
      path: "/api/v1/orders/",
      method: "POST",
      body: {
        ...orderData,
        items: normalizedItems,
      },
      accessToken,
    });

  return normalizeOrder(
    response,
  );
}

/* -------------------------------------------------------------------------- */
/* Current user profile                                                       */
/* -------------------------------------------------------------------------- */

export async function getUserProfile(
  accessToken: string,
): Promise<UserProfile> {
  const response =
    await apiFetch<any>({
      path: "/api/v1/auth/me/",
      accessToken,
    });

  const firstName =
    toStringValue(
      response.first_name,
    );

  const lastName =
    toStringValue(
      response.last_name,
    );

  const fallbackName =
    `${firstName} ${lastName}`.trim();

  const email =
    toStringValue(
      response.email,
    );

  let role: UserProfile["role"] =
    "customer";

  if (
    response.role === "admin"
  ) {
    role = "admin";
  } else if (
    response.role === "superadmin"
  ) {
    role = "superadmin";
  } else if (
    response.role === "vendor" ||
    response.role === "professor"
  ) {
    role = "vendor";
  }

  return {
    id: String(
      response.id,
    ),

    name:
      toStringValue(
        response.name,
      ) ||
      fallbackName ||
      email.split("@")[0] ||
      "",

    email,

    plan:
      toStringValue(
        response.plan,
        "Student",
      ),

    joined:
      toStringValue(
        response.created_at,
        new Date()
          .toISOString()
          .slice(0, 10),
      ),

    role,

    avatarUrl:
      typeof response.avatarUrl ===
      "string"
        ? response.avatarUrl
        : typeof response.avatar_url ===
            "string"
          ? response.avatar_url
          : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/* Downloads                                                                  */
/* -------------------------------------------------------------------------- */

type BackendDownload = {
  id: string | number;
  book?: BackendBook;
  order_number?: string;
  downloads?: number;
  max_downloads?: number;
  remaining_downloads?: number | null;
  expires_at?: string | null;
  is_expired?: boolean;
  is_exhausted?: boolean;
  created_at?: string;
  updated_at?: string;
};

function normalizeDownload(
  download: BackendDownload,
): Download {
  if (!download.book) {
    throw new Error(
      "Download response is missing book data",
    );
  }

  return {
    id: toNumber(
      download.id,
    ),

    book:
      normalizeProduct(
        download.book,
      ),

    orderNumber:
      toStringValue(
        download.order_number,
      ),

    downloads:
      toNumber(
        download.downloads,
      ),

    maxDownloads:
      toNumber(
        download.max_downloads,
      ),

    remainingDownloads:
      download.remaining_downloads ===
      null ||
      download.remaining_downloads ===
        undefined
        ? null
        : toNumber(
            download.remaining_downloads,
          ),

    expiresAt:
      download.expires_at ??
      null,

    isExpired:
      Boolean(
        download.is_expired,
      ),

    isExhausted:
      Boolean(
        download.is_exhausted,
      ),

    createdAt:
      toStringValue(
        download.created_at,
      ),

    updatedAt:
      toStringValue(
        download.updated_at,
      ),
  };
}

export async function getDownloads(
  accessToken: string,
): Promise<Download[]> {
  const response =
    await apiFetch<BackendDownload[]>({
      path: "/api/v1/downloads/",
      accessToken,
    });

  return response.map(
    normalizeDownload,
  );
}

/* -------------------------------------------------------------------------- */
/* Download a product                                                         */
/* -------------------------------------------------------------------------- */

export async function downloadProduct(
  slug: string,
  accessToken: string,
): Promise<Blob> {
  return apiFetch<Blob>({
    path: `/api/v1/books/${encodeURIComponent(slug)}/download/`,
    method: "GET",
    accessToken,
  });
}