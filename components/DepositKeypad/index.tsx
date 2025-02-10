"use client";
/// deposit keypad

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

import { ConversionRate as ConversionRateType } from "@/types";

import { triggerHapticFeedback } from "@/lib/haptics";
import { toastInfo, toastError, toastLoading } from "@/lib/toast";

const MotionButton = motion.create(Button);

export function DepositKeypad({ conversionRate }: ConversionRateType) {
  const [amount, setAmount] = useState("");
  const [shake, setShake] = useState(false);

  const router = useRouter();

  const handleNumberClick = useCallback(
    (num: string) => {
      triggerHapticFeedback();
      if (num === "backspace") {
        setAmount((prev) => prev.slice(0, -1) || "");
      } else if (num === "." && (amount.includes(".") || amount === "")) {
        return;
      } else if (amount.includes(".") && amount.split(".")[1]?.length >= 2) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      } else {
        setAmount((prev) => prev + num);
      }
    },
    [amount]
  );

  const handleContinue = useCallback(() => {
    if (!amount || Number.parseFloat(amount) < 0.2) {
      toastError("Enter a valid amount greater than 0.2");
      return;
    }
    toastLoading("Proceeding to checkout...");
    router.push(`/deposit/checkout?amount=${amount}`);
  }, [amount, router]);

  const formatAmount = useCallback((value: string) => {
    if (!value) return "0";
    const numericValue = Number.parseFloat(value);
    if (isNaN(numericValue)) return "0";
    return numericValue.toFixed(value.includes(".") ? 2 : 0);
  }, []);

  const calculateFiatEquivalent = useCallback((cryptoAmount: string) => {
    const cryptoValue = Number.parseFloat(cryptoAmount);
    if (isNaN(cryptoValue)) return "0";

    return (cryptoValue * (conversionRate || 0)).toFixed(0);
  }, []);

  const isAmountValid = Number.parseFloat(amount) >= 0.2;

  return (
    <motion.div
      className="flex flex-col h-screen bg-background fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex-1 flex flex-col justify-center items-center space-y-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={amount}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: shake ? [0, -5, 5, -5, 5, 0] : 0,
              transition: {
                duration: 0.3,
                ease: "easeOut",
                x: shake ? { duration: 0.3 } : undefined,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
            className="text-center"
          >
            <div
              className={`text-5xl font-bold ${
                !isAmountValid ? "text-red-500" : ""
              }`}
            >
              ${formatAmount(amount)}
            </div>
            <div className="text-xl text-muted-foreground mt-2">
              KES {calculateFiatEquivalent(formatAmount(amount))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-24 px-4 mb-10">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "backspace"].map((num) => (
            <MotionButton
              key={num}
              variant="ghost"
              size="lg"
              onClick={() => handleNumberClick(num.toString())}
              whileTap={{ scale: 0.95 }}
              className="h-16 text-2xl font-semibold rounded-full"
            >
              {num === "backspace" ? <Delete className="w-8 h-8" /> : num}
            </MotionButton>
          ))}
        </div>
      </div>

      <div className="fixed bottom-5 left-0 right-0 p-4 bg-background border-t">
        <MotionButton
          className="w-full text-xl rounded-lg py-6"
          disabled={!isAmountValid}
          onClick={handleContinue}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Continue
        </MotionButton>
      </div>
    </motion.div>
  );
}
