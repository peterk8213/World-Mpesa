"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Button as MinikitButton } from "@worldcoin/mini-apps-ui-kit-react/Button";

import { WithdrawKeypadProps } from "@/types";
import { toastInfo } from "@/lib/toast";

import { Delete } from "lucide-react";

/// motion() is deprecated. Use motion.create() instead.
const MotionButton = motion.create(Button);
const MotionButtonMinikit = motion.create(MinikitButton);

// const MotionButton = motion(Button);

export default function WithdrawKeypad({
  method,
  account,
  balance,
  conversionRate: { conversionRate },
}: WithdrawKeypadProps) {
  const [amount, setAmount] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backspaceClicks, setBackspaceClicks] = useState(0); // Added state for backspace clicks
  const router = useRouter();

  const handleNumberClick = useCallback(
    (num: string) => {
      setError(null);
      if (num === "backspace") {
        setBackspaceClicks((prev) => prev + 1);
        if (backspaceClicks > 4) {
          setAmount("");
          setBackspaceClicks(0);
        } else {
          setAmount((prev) => prev.slice(0, -1) || "");
        }
      } else {
        setBackspaceClicks(0);
        if (num === "." && (amount.includes(".") || amount === "")) {
          return;
        } else if (amount.includes(".") && amount.split(".")[1]?.length >= 2) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          return;
        } else {
          const newAmount = amount + num;
          if (Number.parseFloat(newAmount) > balance) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
          }
          setAmount(newAmount);
        }
      }
    },
    [amount, balance, backspaceClicks] // Added backspaceClicks to dependencies
  );

  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const newAmount = (balance * percentage).toFixed(2);
      setAmount(newAmount);
      setError(null);
    },
    [balance]
  );

  const handleSubmit = useCallback(() => {
    const withdrawAmount = Number.parseFloat(amount);
    if (!amount || withdrawAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (withdrawAmount > balance) {
      toastInfo("Insufficient funds");
      setError("Insufficient funds");
      return;
    }
    if (withdrawAmount < 1) {
      toastInfo("Minimum withdrawal amount is $1");

      setError("Minimum withdrawal amount is $1");
      return;
    }

    router.push(
      `/withdraw/checkout?method=${encodeURIComponent(
        method
      )}&amount=${encodeURIComponent(amount)}&account=${encodeURIComponent(
        account
      )}`
    );
  }, [amount, method, balance, router]);

  const formatAmount = useCallback((value: string) => {
    if (!value) return "0";
    const numericValue = Number.parseFloat(value);
    if (isNaN(numericValue)) return "0";
    return numericValue.toFixed(value.includes(".") ? 2 : 0);
  }, []);

  const calculateFiatEquivalent = useCallback((cryptoAmount: string) => {
    const cryptoValue = Number.parseFloat(cryptoAmount);
    if (isNaN(cryptoValue)) return "0";

    return (cryptoValue * conversionRate).toFixed(2);
  }, []);

  const isAmountValid =
    Number.parseFloat(amount) >= 1 && Number.parseFloat(amount) <= balance;

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

  useEffect(() => {
    // Added useEffect to reset backspaceClicks
    if (backspaceClicks > 0) {
      const timer = setTimeout(() => setBackspaceClicks(0), 300);
      return () => clearTimeout(timer);
    }
  }, [backspaceClicks]);

  return (
    <motion.div
      className="flex flex-col  bg-background fixed  p-4 overflow-auto xs:mt-5 top-0 bottom-0 left-0 right-0 justify-around"
      initial={{ x: -50, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: easeInOut },
      }}
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
              {formatAmount(amount)}
            </div>
            <div className="text-xl text-muted-foreground mt-2">
              KES {calculateFiatEquivalent(formatAmount(amount))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Available balance: ${balance.toFixed(2)}
            </p>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-evenly space-x-2 mb-6 px-3">
        {[25, 50, 75, 100].map((percentage) => (
          <Button
            key={percentage}
            variant="ghost"
            size="sm"
            onClick={() => handlePercentageClick(percentage / 100)}
            className="text-sm font-semibold  outline-dotted rounded-full"
          >
            {percentage}%
          </Button>
        ))}
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
        <MotionButtonMinikit
          className="w-full text-xl rounded-lg py-6"
          disabled={!isAmountValid}
          onClick={handleSubmit}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Continue
        </MotionButtonMinikit>
      </div>
    </motion.div>
  );
}
