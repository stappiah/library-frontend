"use client";

import { AccountActions } from "@/components/sections/account-actions";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/authSlice";
import type { Order } from "@/types/ecommerce";
import { log } from "console";

interface AccountDashboardProps {
  orders: Order[];
}

export function AccountDashboard({ orders }: AccountDashboardProps) {
  const auth = useAppSelector(selectAuth);
  const user = auth.user;

  console.log("AccountDashboard user:", user);

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
    </div>
  );
}
