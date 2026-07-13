import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/types/ecommerce";

export interface CartEntry {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartEntry[];
  wishlist: number[];
  isOpen: boolean;
}

const STORAGE_KEY = "luma-cart-state";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

const initialState: CartState = {
  items: readStorage<CartEntry[]>(STORAGE_KEY, []),
  wishlist: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      const saved = readStorage<{ items?: CartEntry[]; wishlist?: number[] } | null>(STORAGE_KEY, null);
      if (saved) {
        state.items = saved.items ?? state.items;
        state.wishlist = saved.wishlist ?? state.wishlist;
      }
    },
    addToCart: (state, action: { payload: { product: Product; quantity?: number } }) => {
      const existing = state.items.find((entry) => entry.product.id === action.payload.product.id);
      if (existing) {
        existing.quantity += action.payload.quantity ?? 1;
      } else {
        state.items.push({ product: action.payload.product, quantity: action.payload.quantity ?? 1 });
      }
      state.isOpen = true;
      writeStorage(STORAGE_KEY, { items: state.items, wishlist: state.wishlist });
    },
    updateQuantity: (state, action: { payload: { productId: number; quantity: number } }) => {
      state.items = state.items
        .map((entry) => (entry.product.id === action.payload.productId ? { ...entry, quantity: action.payload.quantity } : entry))
        .filter((entry) => entry.quantity > 0);
      writeStorage(STORAGE_KEY, { items: state.items, wishlist: state.wishlist });
    },
    removeFromCart: (state, action: { payload: number }) => {
      state.items = state.items.filter((entry) => entry.product.id !== action.payload);
      writeStorage(STORAGE_KEY, { items: state.items, wishlist: state.wishlist });
    },
    toggleWishlist: (state, action: { payload: number }) => {
      state.wishlist = state.wishlist.includes(action.payload)
        ? state.wishlist.filter((id) => id !== action.payload)
        : [...state.wishlist, action.payload];
      writeStorage(STORAGE_KEY, { items: state.items, wishlist: state.wishlist });
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
      writeStorage(STORAGE_KEY, { items: state.items, wishlist: state.wishlist });
    },
  },
});

export const { hydrateCart, addToCart, updateQuantity, removeFromCart, toggleWishlist, openCart, closeCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
