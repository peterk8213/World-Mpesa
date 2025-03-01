"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Wallet, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);

type PaymentMethod = {
  id: string;
  fullName: string;
  phone: string;
  provider: string;
};

export default function PaymentMethods({
  paymentMethodsCount,
}: {
  paymentMethodsCount: number;
}) {
  return (
    <main className="space-y-6 pt-3 shadow-lg  backdrop-blur-sm">
      {/* Payment Methods Overview */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 p-7 text-white "
        whileTap={{ scale: 1.1, z: 2 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-200">
                Payment Methods
              </h3>
              <p className="text-sm text-gray-400">
                Manage your payment options
              </p>
            </div>
            <Link href="/withdraw/add-account">
              <MotionButton
                whileTap={{ scale: 1.05 }}
                size="sm"
                className="rounded-full bg-white/10 px-4 hover:bg-white/20"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </MotionButton>
            </Link>
          </div>
          {paymentMethodsCount < 1 ? (
            <div>
              <p className="text-sm text-gray-400">
                You have no payment methods added yet.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Link href="/withdraw/manage/account">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Wallet className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold">
                      {paymentMethodsCount}
                    </div>
                    <div className="text-sm text-gray-400">Active Methods</div>
                  </div>
                </div>
              </Link>
              <motion.div whileTap={{ rotate: 360 }}>
                <Link href="/withdraw/manage/account">
                  <Settings className="h-5 w-5 text-gray-300" />
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
