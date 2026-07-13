export type ProductSize = "XS" | "S" | "M" | "L" | "XL";
export type UserRole = "customer" | "vendor" | "admin" | "superadmin";
export type ProductStatus = "draft" | "published" | "archived";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  name: string;
  slug: string;
  email: string;
  bio: string;
  specialties: string[];
  rating: number;
  productsCount: number;
  status: "pending" | "active" | "suspended";
  commissionRate?: number;
  location?: string;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  brand: string;
  description: string;
  highlights: string[];
  images: string[];
  badge?: string;
  colors: string[];
  sizes: ProductSize[];
  inventory: number;
  reviews: Review[];
  careInstructions: string[];
  vendorId: number;
  vendorName: string;
  vendorSlug?: string;
  status?: ProductStatus;
  categories?: string[];
  isbn?: string;
  format?: "Paperback" | "Hardcover" | "Ebook" | "PDF";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  count: number;
  parentId?: string;
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

export interface OrderItem {
  id: string;
  productId: number;
  title: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  vendorId: number;
  vendorName: string;
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
  status: OrderStatus | "Processing" | "Delivered" | "Shipped" | "Cancelled";
  total: number;
  items: number;
  userId?: string;
  vendorId?: number;
  orderNumber?: string;
  createdAt?: string;
  itemsDetail?: OrderItem[];
  shippingAddress?: Address;
  paymentStatus?: string;
}
