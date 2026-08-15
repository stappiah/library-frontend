"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Moon, Search, ShoppingBag, Sun, X } from "lucide-react";

import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/authSlice";

const navLinks = [
  { href: "/shop", label: "Shop E-books" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account", label: "Account / My Library" },
];

export function Navbar() {
  const { cart, openCart } = useAppStore();
  const auth = useAppSelector(selectAuth);

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Only vendors and admins can see the Lecturer Portal
  const canAccessLecturerPortal =
    auth.user?.role === "vendor" || auth.user?.role === "admin";

  useEffect(() => {
    const saved = localStorage.getItem("luma-theme");

    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const nextTheme =
      saved === "dark" || (!saved && systemPrefersDark)
        ? "dark"
        : "light";

    setTheme(nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    );

    document.documentElement.style.colorScheme =
      nextTheme === "dark" ? "dark" : "light";
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    localStorage.setItem("luma-theme", nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark"
    );

    document.documentElement.style.colorScheme =
      nextTheme === "dark" ? "dark" : "light";
  };

  const cartCount = useMemo(() => {
    if (!Array.isArray(cart)) {
      return 0;
    }

    return cart.reduce(
      (sum, item) => sum + (item?.quantity ?? 0),
      0
    );
  }, [cart]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-black tracking-tight text-zinc-950 dark:text-white"
        >
          KTU E-bookshop
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-300 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-zinc-950 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          {/* Lecturer Portal - Only visible to vendors and admins */}
          {canAccessLecturerPortal && (
            <Link
              href="/vendors"
              className="font-semibold text-blue-600 transition hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Lecturer Portal
            </Link>
          )}
        </nav>

        {/* Search */}
        <div className="hidden flex-1 items-center justify-center px-6 md:flex">
          <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <Search className="h-4 w-4" />
            <span>Search for products, brands, and collections</span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Shopping Cart */}
          <Button
            variant="secondary"
            size="sm"
            onClick={openCart}
            className="rounded-full"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{cartCount}</span>
          </Button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-full border border-zinc-200 p-2 md:hidden dark:border-zinc-800"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden"
        >
          <div className="space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Lecturer Portal - Only visible to vendors and admins */}
            {canAccessLecturerPortal && (
              <Link
                href="/vendors"
                className="block rounded-2xl px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400"
                onClick={() => setOpen(false)}
              >
                Lecturer Portal
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}