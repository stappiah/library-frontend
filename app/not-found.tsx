import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">404</p>
      <h1 className="mt-3 text-4xl font-bold text-zinc-950 dark:text-white">This page has drifted out of view.</h1>
      <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
        The page you’re looking for isn’t here. Head back to the storefront to continue exploring.
      </p>
      <Link href="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
