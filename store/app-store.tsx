"use client";

import { useEffect, useMemo, useCallback, type ReactNode } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, type AppDispatch, type RootState } from "./store";
import { addToCart as addCartItem, clearCart, closeCart, hydrateCart, openCart, removeFromCart as removeCartItem, toggleWishlist, updateQuantity as updateCartQuantity } from "./slices/cartSlice";
import { hydrateAuth } from "./slices/authSlice";
import { fetchCatalog } from "./slices/catalogSlice";
import type { Product } from "@/types/ecommerce";

type ProductId = Product["id"];

export interface CartEntry {
  product: Product;
  quantity: number;
}

interface AppStoreContextValue {
  cart: CartEntry[];
  wishlist: ProductId[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: ProductId, quantity: number) => void;
  removeFromCart: (productId: ProductId) => void;
  toggleWishlist: (productId: ProductId) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

function StoreBootstrapper({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateCart());
    dispatch(hydrateAuth());
    dispatch(fetchCatalog());
  }, [dispatch]);

  return <>{children}</>;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <StoreBootstrapper>{children}</StoreBootstrapper>
    </Provider>
  );
}

export function useAppStore() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const isCartOpen = useSelector((state: RootState) => state.cart.isOpen);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    dispatch(addCartItem({ product, quantity }));
  }, [dispatch]);

  const updateQuantity = useCallback((productId: ProductId, quantity: number) => {
    dispatch(updateCartQuantity({ productId, quantity }));
  }, [dispatch]);

  const removeFromCart = useCallback((productId: ProductId) => {
    dispatch(removeCartItem(productId));
  }, [dispatch]);

  const toggleWishlistValue = useCallback((productId: ProductId) => {
    dispatch(toggleWishlist(productId));
  }, [dispatch]);

  const openCartSidebar = useCallback(() => {
    dispatch(openCart());
  }, [dispatch]);

  const closeCartSidebar = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const clearCartItems = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return useMemo<AppStoreContextValue>(
    () => ({
      cart,
      wishlist,
      isCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist: toggleWishlistValue,
      openCart: openCartSidebar,
      closeCart: closeCartSidebar,
      clearCart: clearCartItems,
    }),
    [cart, wishlist, isCartOpen, addToCart, updateQuantity, removeFromCart, toggleWishlistValue, openCartSidebar, closeCartSidebar, clearCartItems],
  );
}
