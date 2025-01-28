"use client";
import { cache } from "react";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

const MotionButton = motion(Button);

interface WithdrawKeypadProps {
  method: string;
  balance: number;
}

export function WithdrawKeypad({ method, balance }: WithdrawKeypadProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleNumberClick = useCallback(
    (num: string) => {
      setError(null);
      if (num === "backspace") {
        setAmount((prev) => prev.slice(0, -1));
      } else if (num === "." && amount.includes(".")) {
        // Prevent multiple decimal points
      } else if (amount.includes(".") && amount.split(".")[1]?.length >= 2) {
        // Limit decimal places to 2
      } else {
        setAmount((prev) => {
          const newAmount = prev + num;
          return Number.parseFloat(newAmount) > balance ? prev : newAmount;
        });
      }
    },
    [amount, balance]
  );

  const handleMaxClick = useCallback(() => {
    setAmount(balance.toFixed(2));
    setError(null);
  }, [balance]);

  const handleSubmit = useCallback(() => {
    const withdrawAmount = Number.parseFloat(amount);
    if (!amount || withdrawAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (withdrawAmount > balance) {
      setError("Insufficient funds");
      return;
    }
    if (withdrawAmount < 1) {
      setError("Minimum withdrawal amount is $1");
      return;
    }
    router.push(
      `/withdraw/checkout?method=${encodeURIComponent(
        method
      )}&amount=${encodeURIComponent(amount)}`
    );
  }, [amount, method, balance, router]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        handleNumberClick(e.key);
      } else if (e.key === "Backspace") {
        handleNumberClick("backspace");
      } else if (e.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleNumberClick, handleSubmit]);

  const keypadButtons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "backspace",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={amount}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-6xl font-bold mb-2"
          >
            ${amount || "0"}
          </motion.div>
        </AnimatePresence>
        <p className="text-sm text-gray-500">
          Available balance: ${balance.toFixed(2)}
        </p>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {keypadButtons.map((btn) => (
          // i will remove the outline
          <MotionButton
            key={btn}
            onClick={() => handleNumberClick(btn)}
            variant="outline"
            size="lg"
            whileTap={{ scale: 0.95 }}
            className="h-16 text-2xl font-semibold rounded-full"
          >
            {btn === "backspace" ? <Delete className="w-6 h-6" /> : btn}
          </MotionButton>
        ))}
      </div>
      {/* ///// adjusted the margin */}
      <div className="flex space-x-4 mt-4">
        <Button onClick={handleMaxClick} className="flex-1 py-6">
          Max
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 py-6"
          disabled={!amount || Number.parseFloat(amount) <= 1}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
