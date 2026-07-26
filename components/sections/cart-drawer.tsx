"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } = useAppStore();
  const safeCart = Array.isArray(cart) ? cart : [];

  const subtotal = safeCart.reduce((sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/40"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white p-5 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Cart</p>
                <h2 className="mt-2 text-xl font-semibold">Your selected pieces</h2>
              </div>
              <button type="button" onClick={closeCart} className="rounded-full border border-zinc-200 p-2 dark:border-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex-1 space-y-4 overflow-y-auto">
              {safeCart.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                  <ShoppingBag className="mx-auto h-8 w-8 text-zinc-500" />
                  <p className="mt-4 font-semibold">Your cart is empty</p>
                  <p className="mt-2 text-sm text-zinc-500">Add a few premium pieces to start building your collection.</p>
                </div>
              ) : (
                safeCart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 rounded-[24px] border border-zinc-200 p-3 dark:border-zinc-800">
                    <div className="relative h-20 w-20 overflow-hidden rounded-[18px]">
                      {item.product.images[0] ? (
                        <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-zinc-950 dark:text-white">{item.product.title}</p>
                          <p className="mt-1 text-sm text-zinc-500">{formatCurrency(item.product.price)}</p>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.product.id)}>
                          <Trash2 className="h-4 w-4 text-zinc-500" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-[24px] border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-4">
                <Link href="/checkout">
                  <Button className="w-full">Go to checkout</Button>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
