"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectIsAuthenticated } from "@/store/slices/authSlice";
import { getOrders } from "@/lib/services/catalog-service";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types/ecommerce";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!accessToken) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getOrders(accessToken)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Order history</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Everything you’ve ordered</h1>
      </div>

      {loading ? (
        <div className="rounded-[30px] border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading orders...</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="rounded-[30px] border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Please sign in to view your order history.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[30px] border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No orders found yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 border-b border-zinc-200 px-4 py-3 text-sm font-semibold dark:border-zinc-800">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span>Total</span>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 border-b border-zinc-100 px-4 py-4 text-sm last:border-b-0 dark:border-zinc-800">
              <span>{order.id}</span>
              <span>{order.date}</span>
              <span>{order.status}</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
