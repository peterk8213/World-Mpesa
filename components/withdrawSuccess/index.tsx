"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
import { Home, Star, MoreVertical } from "lucide-react";
import Link from "next/link";

interface CheckmarkProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
};

export function Checkmark({
  size = 100,
  strokeWidth = 2,
  color = "currentColor",
  className = "",
}: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <title>Animated Checkmark</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.path
        d="M30 50L45 65L70 35"
        stroke={color}
        variants={draw}
        custom={1}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      />
    </motion.svg>
  );
}

interface TransactionProps {
  _id?: string;
  transactionId: {
    amount: number;
    type: string;
    status?: string;
    description: string;
    createdAt: string;
    method: string;

    recipient?: string;
  };
  transactionAmount: number;

  phoneNumber?: string;
  conversionRate: number;
}

export function WithdrawSuccess({
  transaction,
}: {
  transaction: TransactionProps;
}) {
  // Default values for all properties
  const {
    _id,

    transactionId: { amount, type, status, description, createdAt, method },
    phoneNumber,
    transactionAmount,
    conversionRate,
  } = transaction;

  console.log(transaction);
  return (
    <div className=" h-full w-full flex items-center justify-center">
      <Card className="w-full max-w-sm mx-auto  rounded-lg overflow-visible shadow-none border-none">
        <CardContent className="p-6">
          {/* Checkmark */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-emerald-500/20 rounded-full" />
              <Checkmark
                size={80}
                strokeWidth={4}
                color="rgb(16 185 129)"
                className="relative z-10"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg text-zinc-900 font-semibold text-center mb-6">
            Transfer Successful
          </h2>

          {/* Transaction Details */}
          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 mb-4">
            {/* From */}
            <div className="mb-3">
              <span className="text-xs font-medium text-zinc-500 block mb-1">
                From
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white shadow-sm border border-zinc-300 text-sm font-medium text-zinc-900">
                  $
                </span>
                <span className="font-medium text-zinc-900">Wallet</span>
              </div>
            </div>

            <div className="w-full h-px bg-zinc-200 my-3" />

            {/* To */}
            <div className="mb-3">
              <span className="text-xs font-medium text-zinc-500 block mb-1">
                To
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white shadow-sm border border-zinc-300 text-sm font-medium text-zinc-900">
                  {phoneNumber?.charAt(0).toUpperCase() || "P"}
                </span>
                <span className="font-medium text-zinc-900">
                  {phoneNumber || "1234567890"}
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-zinc-200 my-3" />

            {/* Amount */}
            <div className="mb-3">
              <span className="text-xs font-medium text-zinc-500 block mb-1">
                Amount
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white shadow-sm border border-zinc-300 text-sm font-medium text-zinc-900">
                  $
                </span>
                <span className="font-medium text-zinc-900">
                  {amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
              <div className="text-xs text-zinc-500 ml-9 mt-1">
                ≈ {transactionAmount}
              </div>
            </div>

            <div className="w-full h-px bg-zinc-200 my-3" />

            {/* Method */}
            <div className="mb-2">
              <span className="text-xs font-medium text-zinc-500 block mb-1">
                Method
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white shadow-sm border border-zinc-300 text-sm font-medium text-zinc-900">
                  {method.charAt(0).toUpperCase()}
                </span>
                <span className="font-medium text-zinc-900">
                  {method.charAt(0).toUpperCase()}
                  {method.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="text-xs text-zinc-500 mt-3">
              {createdAt.toLocaleString()}
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="text-xs text-zinc-600 text-center mb-4">
            Exchange Rate: 1 USD = {conversionRate.toFixed(2)} KES
          </div>

          {/* Home Button */}
          <Link href="/home" className="w-full block">
            <Button type="submit" variant="ghost" radius="md" fullWidth>
              <div className="flex items-center justify-center gap-2 py-2">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
