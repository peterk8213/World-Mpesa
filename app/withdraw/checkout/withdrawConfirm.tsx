"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WithdrawConfirmProps {
  method: string;
  amount: string;
  balance: number;
  processWithdrawal: (
    method: string,
    amount: string
  ) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
}

export default function WithdrawConfirm({
  method,
  amount,
  balance,
  processWithdrawal,
}: WithdrawConfirmProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processWithdrawal(method, amount);
      if (result.success) {
        router.push(`/withdraw/success?transactionId=${result.transactionId}`);
      } else {
        setError(result.error || "Withdrawal failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const withdrawalAmount = Number.parseFloat(amount);

  if (
    isNaN(withdrawalAmount) ||
    withdrawalAmount <= 0 ||
    withdrawalAmount > balance
  ) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Invalid Withdrawal Request</h2>
        <p>Please go back and enter a valid amount.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md space-y-6 text-center"
    >
      <h2 className="text-2xl font-bold">Confirm Your Withdrawal</h2>
      <div className="text-lg">
        <p>Method: {method}</p>
        <p>Amount: ${amount}</p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-x-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button onClick={handleConfirm} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Confirm Withdrawal"}
        </Button>
      </div>
    </motion.div>
  );
}
