"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useAppStore();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Cart</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Review your final selection</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white px-8 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="mt-2 text-sm text-zinc-500">Add a few premium pieces and come back here to review your order.</p>
              <Link href="/shop" className="mt-5 inline-flex text-sm font-semibold text-zinc-950 dark:text-white">
                Continue shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex flex-col gap-4 rounded-[30px] border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row">
                <div className="relative h-32 w-full overflow-hidden rounded-[24px] sm:w-32">
                  {item.product.images[0] ? (
                    <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" sizes="128px" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900">No image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{item.product.brand}</p>
                      <h2 className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{item.product.title}</h2>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4 text-zinc-500" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-zinc-200 px-2 py-1 dark:border-zinc-800">
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Order summary</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>{formatCurrency(subtotal * 0.08)}</span></div>
          </div>
          <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(subtotal * 1.08)}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-5 block">
            <Button className="w-full">Continue to checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
