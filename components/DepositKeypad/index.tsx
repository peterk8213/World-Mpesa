"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { useRouter } from "next/navigation";

export function DepositKeypad() {
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleNumberClick = (num: string) => {
    if (num === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }
    if (num === "." && amount.includes(".")) return;
    if (amount.includes(".") && amount.split(".")[1]?.length >= 2) return;
    setAmount((prev) => prev + num);
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    router.push(`/deposit/checkout?amount=${amount}`);
  };

  return (
    <main className="  bg-white overflow-hidden lg:overflow-auto">
      <div className="flex flex-col items-center  h-[calc(100vh-64px)]">
        <div className="w-full p-4">
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-2xl mr-2">USD</span>
            <span className="text-6xl font-bold">{amount || "0"}</span>
          </div>
        </div>

        <div className="w-full p-4 mt-20 ">
          <div className="grid grid-cols-3 gap-4 lg:px-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 text-2xl font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                {num}
              </button>
            ))}
            <div className="flex items-center justify-center">
              <button
                onClick={() => handleNumberClick("backspace")}
                className="h-16 text-2xl font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                <Delete className="ml-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-20">
            <Button
              className="w-full lg:w-[50%] py-6 text-lg rounded-full justify-center"
              disabled={!amount || parseFloat(amount) <= 0}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
