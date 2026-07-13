"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectIsAuthenticated } from "@/store/slices/authSlice";
import { getOrders } from "@/lib/services/catalog-service";
import { AccountDashboard } from "@/components/sections/account-dashboard";
import type { Order } from "@/types/ecommerce";

export default function AccountPage() {
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  return <AccountDashboard orders={orders} />;
}

