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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, closeCart, clearCart } = useAppStore();
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [promo, setPromo] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = promo.toLowerCase() === "luma10" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const summary = useMemo(
    () => [
      { label: "Subtotal", value: formatCurrency(subtotal) },
      { label: "Shipping", value: "Free" },
      { label: "Discount", value: discount ? `- ${formatCurrency(discount)}` : "-" },
      { label: "Estimated total", value: formatCurrency(total) },
    ],
    [discount, subtotal, total]
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

    if (cart.length === 0) {
      setMessage("Your cart is empty. Add items before checking out.");
      setStatus("error");
      return;
    }

    if (!form.streetAddress || !form.city || !form.postalCode || !form.phone) {
      setMessage("Please complete all shipping fields before placing your order.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await createOrder(accessToken, {
        shipping_address: `${form.streetAddress}, ${form.city}, ${form.postalCode}`,
        phone: form.phone,
        email: form.email || undefined,
        billing_address: `${form.streetAddress}, ${form.city}, ${form.postalCode}`,
        items: cart.map((item) => ({ book_id: item.product.id, quantity: item.quantity })),
        notes: `Order placed via frontend checkout. Promo: ${promo}`,
      });

      setStatus("success");
      setMessage("Order placed successfully! Redirecting to your account page...");
      closeCart();
      clearCart();
      setTimeout(() => router.push("/account"), 1000);
    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Unable to place order.";
      setStatus("error");
      setMessage(String(errorMessage));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Checkout</p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Complete your premium purchase</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="First name" value={form.firstName} onChange={(event) => handleChange('firstName', event.target.value)} />
            <Input placeholder="Last name" value={form.lastName} onChange={(event) => handleChange('lastName', event.target.value)} />
            <Input placeholder="Email address" value={form.email} onChange={(event) => handleChange('email', event.target.value)} className="sm:col-span-2" />
            <Input placeholder="Street address" value={form.streetAddress} onChange={(event) => handleChange('streetAddress', event.target.value)} className="sm:col-span-2" />
            <Input placeholder="City" value={form.city} onChange={(event) => handleChange('city', event.target.value)} />
            <Input placeholder="Postal code" value={form.postalCode} onChange={(event) => handleChange('postalCode', event.target.value)} />
            <Input placeholder="Phone" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} className="sm:col-span-2" />
            <Input placeholder="Card number" value={form.cardNumber} onChange={(event) => handleChange('cardNumber', event.target.value)} className="sm:col-span-2" />
            <Input placeholder="MM/YY" value={form.expiry} onChange={(event) => handleChange('expiry', event.target.value)} />
            <Input placeholder="CVC" value={form.cvc} onChange={(event) => handleChange('cvc', event.target.value)} />
          </div>

          <div className="mt-6 rounded-[24px] border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={promo}
                onChange={(event) => setPromo(event.target.value)}
                placeholder="Promo code"
              />
              <Button variant="secondary" type="button" onClick={() => setMessage(promo ? `Promo code ${promo} applied.` : "Enter a promo code.")}>Apply</Button>
            </div>
            <p className="mt-3 text-sm text-zinc-500">Try “luma10” for 10% off.</p>
          </div>
          {message ? (
            <p className={`mt-4 text-sm ${status === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>{message}</p>
          ) : null}
        </div>

        <div className="rounded-[30px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Summary</p>
          <div className="mt-4 space-y-3 text-sm">
            {summary.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-zinc-500">{item.label}</span>
                <span className="font-semibold text-zinc-950 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] bg-zinc-50 p-4 dark:bg-zinc-950">
            <p className="text-sm text-zinc-500">Secure checkout</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Our checkout experience is optimized for premium storefronts with fast payment, clear totals, and guest-friendly flows.
            </p>
          </div>

          <Button className="mt-5 w-full" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Placing order...' : 'Place order'}
          </Button>
        </div>
      </form>
    </div>
  );
}
