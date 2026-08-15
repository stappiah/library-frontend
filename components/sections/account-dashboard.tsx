"use client";

import { useState } from "react";
import { AccountActions } from "@/components/sections/account-actions";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { UserOrderList } from "@/types/ecommerce";
import { BookOpen, Download, Library } from "lucide-react";
import { selectAccessToken } from "@/store/slices/authSlice";
import { downloadProduct } from "@/lib/services/catalog-service";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface AccountDashboardProps {
  orders: UserOrderList[];
}

export function AccountDashboard({ orders }: AccountDashboardProps) {
  const auth = useAppSelector(selectAuth);
  const user = auth.user;
  const catalogProducts = useSelector((state: RootState) => state.catalog.products);
  const [activeTab, setActiveTab] = useState<"account" | "library">("account");

  // Get purchased products from orders
  const purchasedProductIds = orders
    .filter((o) => {
      const s = (o.status || "").toLowerCase();
      return s === "delivered" || s === "processing" || s === "paid" || s === "completed";
    })
    .flatMap((o) => o.items?.map((item) => item.productId) ?? []);

  const normalizedPurchasedProductIds = purchasedProductIds.map((id) => String(id));
  const libraryProducts = catalogProducts.filter((p) => normalizedPurchasedProductIds.includes(String(p.id)));

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

<div className="mt-6 overflow-x-auto">
    <table className="w-full min-w-[850px] text-left">
      <thead>
        <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
          <th className="pb-4 pr-6 font-medium">Book</th>
          <th className="pb-4 px-4 font-medium">Order</th>
          <th className="pb-4 px-4 font-medium">Price</th>
          <th className="pb-4 pl-4 text-right font-medium">Action</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) =>
          order.items.map((item) => {
            const book = item.product ?? { title: "", author: "", image: null, imageUrl: null, productType: "ebook" } as any;

            return (
              <tr
                key={`${order.id}-${item.id}`}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
              >
                {/* Book */}
                <td className="py-5 pr-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={book.image_url || book.image}
                      alt={book.title}
                      className="h-16 w-12 rounded-lg object-cover shadow-sm"
                    />

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-900 dark:text-white">
                        {book.title}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        by {book.author}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {book.product_type === "ebook"
                          ? "E-book"
                          : "Digital Notes"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Order */}
                <td className="px-4 py-5">
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) : ""}
                  </p>
                </td>

                {/* Price */}
                <td className="px-4 py-5">
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    GH₵ {Number(item.subtotal ?? 0).toFixed(2)}
                  </p>

                  {item.quantity > 1 && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Qty: {item.quantity}
                    </p>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-5">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "paid"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : order.status === "pending"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                    {order.status}
                  </span>
                </td>

                {/* Download */}
                <td className="py-5 pl-4 text-right">
                  {order.status === "paid" && (book.fileName || (book as any).digital_file) ? (
                    <DownloadButton
                      slug={(book as any).slug ?? (book as any).id}
                      fileName={(book as any).fileName}
                    />
                  ) : (
                    <span className="text-sm text-zinc-400">Not available</span>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
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
              <div className="rounded-3xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <BookOpen className="mx-auto h-8 w-8 text-zinc-500" />
                <p className="mt-4 font-semibold">No e-books yet</p>
                <p className="mt-2 text-sm text-zinc-500">Purchase e-books from the shop and they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {libraryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 rounded-3xl border border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-blue-50 text-blue-600 dark:bg-blue-950/50">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-950 dark:text-white">{product.title}</p>
                        <p className="text-sm text-zinc-500">{product.vendor?.name ?? "Independent publisher"}</p>
                        <p className="text-xs text-zinc-400">{product.productType}</p>
                      </div>
                    </div>
                    <DownloadButton slug={product.slug ?? product.id} fileName={(product as any).fileName} />
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

function DownloadButton({
  slug,
  fileName,
}: {
  slug: string | number;
  fileName?: string | null;
}) {
  const accessToken = useAppSelector(selectAccessToken);
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (!slug) {
      alert("This product does not have a valid download link.");
      return;
    }

    if (!accessToken) {
      alert("Please sign in again before downloading.");
      return;
    }

    setBusy(true);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const downloadUrl =
        `${apiBaseUrl}/api/v1/books/${encodeURIComponent(String(slug))}/download/`;

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        let message = "Download failed. Please try again.";

        try {
          const data = await response.json();

          message =
            data?.detail ||
            data?.error ||
            message;
        } catch {
          // Response wasn't JSON.
        }

        if (response.status === 401) {
          message = "Your session has expired. Please sign in again.";
        } else if (response.status === 403) {
          message =
            message ||
            "You are not allowed to download this product.";
        } else if (response.status === 404) {
          message = "The digital file could not be found.";
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error("The downloaded file is empty.");
      }

      /*
       * Try to get the filename from Django's
       * Content-Disposition header.
       */
      const contentDisposition =
        response.headers.get("Content-Disposition");

      let downloadName = fileName || `${String(slug)}.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename="?([^"]+)"?/i
        );

        if (match?.[1]) {
          downloadName = match[1];
        }
      }

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Download failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleDownload}
      disabled={busy || !accessToken}
      className="inline-flex items-center gap-2"
    >
      <Download className="h-4 w-4" />

      {busy ? "Downloading..." : "Download"}
    </Button>
  );
}
