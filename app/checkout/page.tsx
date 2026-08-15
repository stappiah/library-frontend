"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectIsAuthenticated } from "@/store/slices/authSlice";
import { createOrder } from "@/lib/services/catalog-service";
import { MobileMoneyModal } from "@/components/sections/mobile-money-modal";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, closeCart, clearCart } = useAppStore();
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileMoneyNumber: "",
  });

  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce((sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0), 0);
  const total = subtotal;

  const summary = useMemo(
    () => [
      { label: "Subtotal", value: formatCurrency(subtotal) },
      { label: "Total", value: formatCurrency(total) },
    ],
    [subtotal, total]
  );

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!accessToken || !isAuthenticated) {
      setMessage("Please log in to place your order.");
      setStatus("error");
      return;
    }

    if (safeCart.length === 0) {
      setMessage("Your cart is empty. Add items before checking out.");
      setStatus("error");
      return;
    }

    if (!form.name || !form.email || !form.mobileMoneyNumber) {
      setMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    // Show Mobile Money authorization popup
    setShowMomoModal(true);
  };

  const handleMomoConfirm = async () => {
    setShowMomoModal(false);
    setStatus("loading");

    try {
      await createOrder(accessToken!, {
        shipping_address: "E-book (digital delivery)",
        phone: form.mobileMoneyNumber,
        email: form.email,
        status: "paid",
        billing_address: "E-book (digital delivery)",
        items: safeCart.map((item) => ({ book_id: item.product.id, quantity: item.quantity })),
        notes: `Mobile Money: ${form.mobileMoneyNumber}. Name: ${form.name}. E-book order.`,
      });

      setStatus("success");
      setMessage("Payment successful! Your e-book is ready to download. Redirecting to your library...");
      closeCart();
      clearCart();
      setTimeout(() => router.push("/account"), 1500);
    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Unable to process payment.";
      setStatus("error");
      setMessage(String(errorMessage));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Checkout</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Complete your e-book purchase</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Payment Details</p>
          <p className="mt-1 text-xs text-zinc-400">Pay securely with Mobile Money (MoMo)</p>
          <div className="mt-4 grid gap-4">
            <Input 
              placeholder="Full name" 
              value={form.name} 
              onChange={(event) => handleChange('name', event.target.value)} 
              required
            />
            <Input 
              placeholder="Email address" 
              type="email" 
              value={form.email} 
              onChange={(event) => handleChange('email', event.target.value)} 
              required
            />
            <Input 
              placeholder="Mobile Money number (e.g. 054XXXXXXX)" 
              value={form.mobileMoneyNumber} 
              onChange={(event) => handleChange('mobileMoneyNumber', event.target.value)} 
              required
            />
          </div>

          {message ? (
            <p className={`mt-4 text-sm ${status === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>{message}</p>
          ) : null}
        </div>

        <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Order Summary</p>
          <div className="mt-4 space-y-3 text-sm">
            {summary.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-zinc-500">{item.label}</span>
                <span className="font-semibold text-zinc-950 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Cart items summary */}
          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Items</p>
            {safeCart.map((item) => (
              <div key={item.product.id} className="mb-2 flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-300">{item.product.title} × {item.quantity}</span>
                <span className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-zinc-50 p-4 dark:bg-zinc-950">
            <p className="text-sm text-zinc-500">Mobile Money Payment</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              You will receive a Mobile Money authorization prompt on your phone after placing the order. Enter your MoMo PIN to complete payment.
            </p>
          </div>

          <Button className="mt-5 w-full" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Processing...' : `Pay ${formatCurrency(total)} with MoMo`}
          </Button>
        </div>
      </form>

      {showMomoModal && (
        <MobileMoneyModal
          amount={total}
          phoneNumber={form.mobileMoneyNumber}
          onConfirm={handleMomoConfirm}
          onCancel={() => setShowMomoModal(false)}
        />
      )}
    </div>
  );
}

