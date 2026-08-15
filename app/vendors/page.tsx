"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Upload,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getVendorOrders, getVendors } from "@/lib/services/catalog-service";
import type { VendorProfile } from "@/types/ecommerce";

type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "paid";

type VendorOrder = {
  id: number;
  customer: string;
  email: string;
  book: string;
  amount: number;
  paymentStatus: "paid" | "pending" | "failed";
  status: OrderStatus;
  createdAt: string;
};

const initialOrders: VendorOrder[] = [
  {
    id: 1001,
    customer: "Kwame Mensah",
    email: "kwame@example.com",
    book: "Introduction to Microeconomics",
    amount: 85,
    paymentStatus: "paid",
    status: "completed",
    createdAt: "Aug 14, 2026",
  },
  {
    id: 1002,
    customer: "Ama Boateng",
    email: "ama@example.com",
    book: "Advanced Financial Accounting",
    amount: 120,
    paymentStatus: "paid",
    status: "processing",
    createdAt: "Aug 13, 2026",
  },
  {
    id: 1003,
    customer: "Yaw Asante",
    email: "yaw@example.com",
    book: "Research Methods for Students",
    amount: 70,
    paymentStatus: "pending",
    status: "pending",
    createdAt: "Aug 12, 2026",
  },
  {
    id: 1004,
    customer: "Akosua Owusu",
    email: "akosua@example.com",
    book: "Principles of Marketing",
    amount: 95,
    paymentStatus: "paid",
    status: "completed",
    createdAt: "Aug 11, 2026",
  },
];

const paymentStyles = {
  paid: "text-emerald-600 dark:text-emerald-400",
  pending: "text-amber-600 dark:text-amber-400",
  failed: "text-red-600 dark:text-red-400",
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>(initialOrders);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    getVendors()
      .then(setVendors)
      .catch(() => setVendors([]));
  }, []);

  useEffect(() => {
    getVendorOrders()
      .then((orders) => {
        // Map backend vendor orders to the local `VendorOrder` shape used by this page
        const mapped = orders.map((o) => {
          const firstItem = o.items && o.items.length > 0 ? o.items[0] : null;

          return {
            id: Number(o.id),
            customer: o.customerName || "",
            email: o.customerEmail || o.email || "",
            book: firstItem ? firstItem.title : `(${o.itemsCount} items)`,
            amount: Number(o.vendorTotal ?? 0),
            createdAt: o.createdAt ?? "",
          } as VendorOrder;
        });

        setOrders(mapped);
      })
      .catch((error) => {
        console.error("Failed to fetch vendor orders:", error);
        setOrders([]);
      });
  }, []);

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    setUpdatingOrder(orderId);

    try {
      /*
       * Replace this section with your Django API call.
       *
       * Example:
       *
       * await updateVendorOrder(orderId, { status });
       */

      // Temporary local update
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const totalSales = orders.reduce((total, order) => total + order.amount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      {/* Header */}
      <div className="rounded-[32px] border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              <GraduationCap className="h-4 w-4" />
              Lecturer Portal
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              Upload and manage your e-books for tertiary students.
            </h1>

            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Lecturers can upload e-books in PDF/Word format, set prices in
              Ghana Cedis, and reach students across various faculties.
            </p>
          </div>

          <Link href="/vendor">
            <Button size="lg">
              <Upload className="h-4 w-4" />
              Upload E-book
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Orders */}
      <div className="mt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Vendor Orders
            </p>

            <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">
              Orders received
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              View purchases of your e-books and update their order status.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-semibold text-zinc-900 dark:text-white">
              {orders.length}
            </span>
            Total orders
            <span className="font-semibold text-zinc-900 dark:text-white">
              · GH₵ {totalSales.toFixed(2)}
            </span>
            Total sales
          </div>
        </div>

        {/* Table wrapper */}
        <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Order
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    E-book
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <BookOpen className="h-6 w-6 text-zinc-500" />
                      </div>

                      <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
                        No orders yet
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        Orders for your e-books will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            #{order.id}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {order.createdAt}
                          </p>
                        </div>
                      </td>

                      {/* Student */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {order.customer}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {order.email}
                          </p>
                        </div>
                      </td>

                      {/* Book */}
                      <td className="px-6 py-5">
                        <div className="flex max-w-[250px] items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <BookOpen className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                          </div>

                          <p className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-white">
                            {order.book}
                          </p>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          GH₵ {order.amount.toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Existing lecturer storefronts */}
      {/* <div className="mt-14">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Lecturers
          </p>

          <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">
            Browse lecturer storefronts
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-bold text-zinc-900 dark:text-white">
                {vendor.name}
              </h3>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
