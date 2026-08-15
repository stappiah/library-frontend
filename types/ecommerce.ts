export type UserRole = "customer" | "vendor" | "admin" | "superadmin";

export type ProductType =
  | "ebook"
  | "notes"
  | "template"
  | "software"
  | "course";

export type ProductStatus = "draft" | "published" | "archived";

export type VendorStatus = "pending" | "active" | "suspended";

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export interface Review {
  id: number | string;
  user: number | string | null;
  userName?: string;
  rating: number;
  title: string;
  content?: string;
  helpfulCount?: number;
  createdAt?: string;
  avatar?: string;
  body?: string;
  date?: string;
}

export interface VendorProfile {
  id: number | string;
  userId?: number | string;
  name: string;
  slug: string;
  email: string;
  description: string;
  logo?: string | null;
  phone?: string | null;
  address?: string | null;
  rating: number;
  productsCount: number;
  status: VendorStatus;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  specialties?: string[];
  location?: string;
  commissionRate?: number;
}

export interface VendorOrderList {
  id: number | string;

  orderNumber: string;

  customerName: string;
  customerEmail: string;

  email: string;

  status: string;

  vendorTotal: number;

  itemsCount: number;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
}

export interface UserOrderList {
  id: number | string;

  orderNumber: string;

  customerName: string;
  customerEmail: string;

  email: string;

  status: string;

  vendorTotal: number;

  itemsCount: number;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
}

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  icon?: string;
  count?: number;
}

export interface Faculty {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface ProductImage {
  id: number;
  image: string;
  altText?: string;
}

export interface Product {
  id: number | string;
  slug: string;

  title: string;
  author: string;
  description: string;

  price: number;
  discountPrice?: number | null;
  discountPercentage: number;

  productType: ProductType;

  category?: Category | null;
  faculty?: Faculty | null;
  vendor?: VendorProfile | null;

  isbn?: string | null;
  publisher?: string | null;
  publicationYear?: number | null;
  pages?: number | null;
  language: string;

  image?: string | null;
  imageUrl?: string | null;
  images: string[];
  galleryImages: ProductImage[];

  rating: number;
  reviewsCount: number;
  reviews: Review[];

  isFeatured: boolean;

  fileName?: string | null;
  fileSize?: number | null;

  downloadLimit: number;
  downloadExpiryDays: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface OrderSummary {
  id: string;
  label: string;
  value: number;
}

export interface OrderItem {
  id: number | string;

  productId: number | string;
  title: string;

  quantity: number;

  unitPrice: number;
  discountPrice?: number | null;

  subtotal: number;

  vendorId?: number | string;
  vendorName?: string;

  product?: Product;
}

export interface Payment {
  id?: string;
  paymentMethod: string;
  paymentStatus: string;
  paidAmount: number;
  transactionReference?: string;
  paidAt?: string;
}

export interface Shipment {
  id?: string;
  carrier?: string;
  trackingNumber?: string;
  status?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: string;
  joined: string;
  role?: UserRole;
  avatarUrl?: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;

  userId?: string;
  orderNumber: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;

  itemsDetail?: OrderItem[];

  email?: string;
  notes?: string;
}

export interface Download {
  id: number;
  book: Product;
  orderNumber: string;
  downloads: number;
  maxDownloads: number;
  remainingDownloads: number | null;
  expiresAt?: string | null;
  isExpired: boolean;
  isExhausted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: string;
}