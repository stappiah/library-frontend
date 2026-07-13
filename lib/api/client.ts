import {
  getCategories,
  getOrders,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  getUserProfile,
  getVendors,
} from "@/lib/services/catalog-service";
import { readAccessToken } from "@/lib/api/auth-storage";
import type { Category, Order, Product, UserProfile, VendorProfile } from "@/types/ecommerce";

export interface CommerceApiClient {
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(slug: string): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  getVendors(): Promise<VendorProfile[]>;
  getOrders(): Promise<Order[]>;
  getUserProfile(): Promise<UserProfile>;
}

export class MockCommerceApiClient implements CommerceApiClient {
  async getProducts() {
    return getProducts();
  }

  async getProductBySlug(slug: string) {
    return getProductBySlug(slug);
  }

  async getProductsByCategory(slug: string) {
    return getProductsByCategory(slug);
  }

  async getCategories() {
    return getCategories();
  }

  async getVendors() {
    return getVendors();
  }

  async getOrders() {
    return getOrders();
  }

  async getUserProfile() {
    const token = readAccessToken();
    if (!token) {
      throw new Error("Missing access token for profile lookup.");
    }
    return getUserProfile(token);
  }
}

export const commerceApi = new MockCommerceApiClient();
