"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { triggerHapticFeedback } from "@/lib/haptics";
import { toastInfo, toastError, toastLoading } from "@/lib/toast";

const MotionButton = motion(Button);

export function DepositKeypad() {
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleNumberClick = useCallback(
    (num: string) => {
      triggerHapticFeedback();
      if (num === "backspace") {
        setAmount((prev) => prev.slice(0, -1));
      } else if (num === "." && amount.includes(".")) {
        // Prevent multiple decimal points
      } else if (amount.includes(".") && amount.split(".")[1]?.length >= 2) {
        // Limit decimal places to 2
      } else {
        setAmount((prev) => prev + num);
      }
    },
    [amount]
  );

  const handleContinue = useCallback(() => {
    if (!amount || Number.parseFloat(amount) < 0.2) {
      toastError("Enter a valid amount grater than 0.2");
      return;
    }
    toastLoading("Proceeding to checkout...");
    router.push(`/deposit/checkout?amount=${amount}`);
  }, [amount, router]);

  const formatAmount = useCallback((value: string) => {
    if (value.includes(".")) {
      return Number.parseFloat(value).toFixed(2);
    }
    return value;
  }, []);

  const calculateFiatEquivalent = useCallback((cryptoAmount: string) => {
    const cryptoValue = Number.parseFloat(cryptoAmount);
    if (isNaN(cryptoValue)) return "0";
    const exchangeRate = 128; // Example exchange rate (1 USD = 120 KES)
    return (cryptoValue * exchangeRate).toFixed(2);
  }, []);

  return (
    <motion.div
      className="flex flex-col h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <main className="flex flex-col flex-1 overflow-auto justify-around">
        <div className="p-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={amount}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="text-4xl font-bold mb-2">
                ${formatAmount(amount) || "0"}
              </div>
              <div className="text-xl text-muted-foreground">
                KES {calculateFiatEquivalent(formatAmount(amount))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-4 mt-10 p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "backspace"].map((num) => (
              <MotionButton
                key={num}
                variant="outline"
                size="lg"
                onClick={() => handleNumberClick(num.toString())}
                whileTap={{ scale: 0.95 }}
                className="h-16 text-2xl font-semibold rounded-full"
              >
                {num === "backspace" ? <Delete className="w-6 h-6" /> : num}
              </MotionButton>
            ))}
          </div>
        </div>

        <div className="mb-6 px-2">
          <MotionButton
            className="w-full  text-xl rounded-s-md px-4"
            disabled={!amount || Number.parseFloat(amount) < 0.2}
            onClick={handleContinue}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </MotionButton>
        </div>
      </main>
    </motion.div>
  );
}
