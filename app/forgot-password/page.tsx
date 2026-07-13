import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Password reset</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Reset access in a few taps</h1>
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            We’ll send a secure link to the email on file so you can create a fresh password.
          </p>
        </div>

        <div className="rounded-[30px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Input placeholder="Email address" type="email" />
          <Button className="mt-5 w-full">Send reset link</Button>
          <p className="mt-6 text-sm text-zinc-500">
            <Link href="/login" className="font-semibold text-zinc-950 dark:text-white">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
