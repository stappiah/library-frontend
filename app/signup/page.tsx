"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, status, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" as "customer" | "vendor" });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Signup</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Create your premium account</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Save favorite products, track orders, and unlock early access to new drops.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[30px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="sm:col-span-2" />
            <Input placeholder="Email address" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="sm:col-span-2" />
            <Input placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="sm:col-span-2" />
            <select className="sm:col-span-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as "customer" | "vendor" }))}>
              <option value="customer">Shop as a student</option>
              <option value="vendor">Sell as a lecturer or vendor</option>
            </select>
          </div>
          <Button className="mt-5 w-full" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Creating account..." : "Create account"}
          </Button>
          {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}
          <p className="mt-6 text-sm text-zinc-500">
            Already have an account? <Link href="/login" className="font-semibold text-zinc-950 dark:text-white">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
