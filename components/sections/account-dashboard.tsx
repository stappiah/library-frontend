"use client";

import { useState } from "react";
import { AccountActions } from "@/components/sections/account-actions";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Order } from "@/types/ecommerce";
import { BookOpen, Download, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface AccountDashboardProps {
  orders: Order[];
}

export function AccountDashboard({ orders }: AccountDashboardProps) {
  const auth = useAppSelector(selectAuth);
  const user = auth.user;
  const catalogProducts = useSelector((state: RootState) => state.catalog.products);
  const [activeTab, setActiveTab] = useState<"account" | "library">("account");

  // Get purchased products from orders
  const purchasedProductIds = orders
    .filter((o) => {
      const s = o.status.toLowerCase();
      return s === "delivered" || s === "processing" || s === "paid";
    })
    .flatMap((o) => o.itemsDetail?.map((item) => item.productId) ?? []);

  const libraryProducts = catalogProducts.filter((p) => purchasedProductIds.includes(p.id));

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Account</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">No account data found</h1>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in again to load your profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Account dashboard</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Welcome back, {user.name}</h1>
        </div>
        <AccountActions />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 rounded-[30px] border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "account"
              ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
              : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          }`}
        >
          Account
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("library")}
          className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "library"
              ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
              : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
          }`}
        >
          <Library className="mr-1 inline-block h-4 w-4" />
          My Library ({libraryProducts.length})
        </button>
      </div>

      {activeTab === "account" ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Profile</p>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-zinc-500">Email</span>
                <span className="ml-3 font-semibold">{user.email}</span>
              </p>
              <p>
                <span className="text-zinc-500">Plan</span>
                <span className="ml-3 font-semibold">{user.plan}</span>
              </p>
              <p>
                <span className="text-zinc-500">Joined</span>
                <span className="ml-3 font-semibold">{user.joined}</span>
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Recent orders</p>
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-3xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-zinc-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold capitalize">{order.status}</p>
                    <p className="text-sm text-zinc-500">{order.items} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* My Library Tab */
        <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-zinc-500" />
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">My Library</p>
          </div>
          <p className="mt-1 text-xs text-zinc-400">Your purchased e-books. Screenshots and recordings are disabled.</p>

          <div className="mt-6 my-library-content">
            {libraryProducts.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <BookOpen className="mx-auto h-8 w-8 text-zinc-500" />
                <p className="mt-4 font-semibold">No e-books yet</p>
                <p className="mt-2 text-sm text-zinc-500">Purchase e-books from the shop and they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {libraryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 rounded-[24px] border border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-blue-50 text-blue-600 dark:bg-blue-950/50">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-950 dark:text-white">{product.title}</p>
                        <p className="text-sm text-zinc-500">{product.brand}</p>
                        <p className="text-xs text-zinc-400">{product.format || "E-book"}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Trigger download of the e-book
                        const link = document.createElement("a");
                        link.href = product.images[0] || "#";
                        link.download = `${product.slug}.pdf`;
                        link.click();
                      }}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
