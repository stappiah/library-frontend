"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface MobileMoneyModalProps {
  amount: number;
  phoneNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MobileMoneyModal({ amount, phoneNumber, onConfirm, onCancel }: MobileMoneyModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-[30px] border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Mobile Money Authorization
              </p>
            </div>
            <button type="button" onClick={onCancel} className="rounded-full border border-zinc-200 p-1 dark:border-zinc-800">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-[24px] bg-blue-50 p-4 dark:bg-blue-950/30">
            <div className="text-center">
              <Smartphone className="mx-auto h-12 w-12 text-blue-600" />
              <p className="mt-3 text-lg font-bold text-zinc-950 dark:text-white">
                {formatCurrency(amount)}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                to {phoneNumber}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] bg-zinc-50 p-4 text-center text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300">
            <p>A payment request has been sent to your mobile phone.</p>
            <p className="mt-1 font-semibold text-zinc-950 dark:text-white">
              Enter your Mobile Money PIN on your phone to complete payment.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              I&apos;ve approved the payment
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

