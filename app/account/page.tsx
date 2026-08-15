"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectIsAuthenticated } from "@/store/slices/authSlice";
import { getOrders, getUserOrders } from "@/lib/services/catalog-service";
import { AccountDashboard } from "@/components/sections/account-dashboard";
import type { Order, UserOrderList } from "@/types/ecommerce";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [orders, setOrders] = useState<UserOrderList[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("user token", accessToken);
  

  // useEffect(() => {
  //   if (!accessToken) {
  //     setOrders([]);
  //     setLoading(false);
  //     return;
  //   }

  //   setLoading(true);
  //   getOrders(accessToken)
  //     .then(setOrders)
  //     .catch(() => setOrders([]))
  //     .finally(() => setLoading(false));
  // }, [accessToken]);

  useEffect(() => {
    setLoading(true);

    getUserOrders()
      .then((res) => {
        console.log("user ", res);
        setOrders(res);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (!isAuthenticated || !accessToken) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl rounded-[30px] border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Account</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Please sign in to view your account</h1>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            You need an active session to see your orders and saved e-books.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Create account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AccountDashboard orders={orders} />;
}

