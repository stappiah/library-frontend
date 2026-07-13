"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, status, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Login</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Welcome back, stylish shopper.</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Access saved preferences, order history, and exclusive member pricing in seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[30px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-4">
            <Input placeholder="Email address" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <Input placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Keep me signed in</label>
              <Link href="/forgot-password" className="text-zinc-950 dark:text-white">Forgot password?</Link>
            </div>
            <Button className="w-full" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Signing in..." : "Continue"}
            </Button>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

          <p className="mt-6 text-sm text-zinc-500">
            New here? <Link href="/signup" className="font-semibold text-zinc-950 dark:text-white">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
