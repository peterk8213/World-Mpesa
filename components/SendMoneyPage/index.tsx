"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  Wallet2,
  Smartphone,
  HelpCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

export function SendMoneyPage() {
  const [selectedOption, setSelectedOption] = useState<
    "mpesa" | "airtel" | null
  >(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleAmountChange = (value: string) => {
    if (!value || Number.parseFloat(value) > 0) {
      setAmount(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
      <div className="relative mx-auto max-w-2xl">
        {/* Decorative elements */}
        <div className="absolute -left-32 -top-20 h-64 w-64 rounded-full bg-purple-100/30 blur-3xl"></div>
        <div className="absolute -right-32 top-40 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl"></div>

        <div className="relative space-y-8 rounded-2xl border border-white/20 bg-white/60 p-8 shadow-2xl backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Send Money
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Fast and secure transfers
            </p>
          </div>

          <div className="grid gap-8">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Select Payment Method
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedOption("mpesa")}
                  className={`group relative overflow-hidden rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                    selectedOption === "mpesa"
                      ? "border-purple-500 bg-purple-50/50"
                      : "border-white/60 bg-white/40 hover:border-purple-200"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={`rounded-full p-2 ${
                        selectedOption === "mpesa"
                          ? "bg-purple-100"
                          : "bg-white/80"
                      }`}
                    >
                      <Wallet2
                        className={`h-6 w-6 ${
                          selectedOption === "mpesa"
                            ? "text-purple-500"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">M-Pesa</p>
                      <p className="text-xs text-gray-500">Instant Transfer</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>

                <button
                  onClick={() => setSelectedOption("airtel")}
                  className={`group relative overflow-hidden rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                    selectedOption === "airtel"
                      ? "border-red-500 bg-red-50/50"
                      : "border-white/60 bg-white/40 hover:border-red-200"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={`rounded-full p-2 ${
                        selectedOption === "airtel"
                          ? "bg-red-100"
                          : "bg-white/80"
                      }`}
                    >
                      <Smartphone
                        className={`h-6 w-6 ${
                          selectedOption === "airtel"
                            ? "text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">Airtel</p>
                      <p className="text-xs text-gray-500">Quick & Easy</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-gray-700"
              >
                Amount
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </div>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="h-14 border-white/60 bg-white/40 pl-8 text-lg backdrop-blur-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-3">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  +
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-14 border-white/60 bg-white/40 pl-8 backdrop-blur-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter recipient's number"
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-3">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] border-white/60 bg-white/40 backdrop-blur-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                placeholder="What's this payment for?"
              />
            </div>

            {/* Confirmation */}
            <div className="rounded-xl border border-white/60 bg-white/40 p-4 backdrop-blur-sm">
              <label className="flex cursor-pointer items-start gap-3">
                <div className="relative mt-1 h-5 w-5">
                  <input
                    type="checkbox"
                    checked={phoneConfirmed}
                    onChange={() => setPhoneConfirmed(!phoneConfirmed)}
                    className="peer absolute h-5 w-5 cursor-pointer opacity-0"
                  />
                  <div className="absolute h-5 w-5 rounded border border-gray-300 bg-white transition-all peer-checked:border-purple-500 peer-checked:bg-purple-500"></div>
                  {phoneConfirmed && (
                    <Check className="absolute left-[3px] top-[3px] h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  I confirm that{" "}
                  <span className="font-medium text-gray-900">
                    {phoneNumber || "the recipient's number"}
                  </span>{" "}
                  is correct and belongs to the intended recipient.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              className={`group relative h-14 overflow-hidden ${
                !phoneNumber || !amount || !phoneConfirmed
                  ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
              disabled={!phoneNumber || !amount || !phoneConfirmed}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Continue
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -z-10 translate-y-full bg-purple-600 transition-transform group-hover:translate-y-0"></div>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setShowSupport(!showSupport)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/60 shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <HelpCircle className="h-6 w-6 text-purple-500" />
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
        </motion.button>
      </div>

      {/* Support Dialog */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Need Help?
              </h3>
              <button
                onClick={() => setShowSupport(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Having trouble with your transfer? Our support team is here to
              help 24/7.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="w-full border-purple-200 bg-white hover:bg-purple-50"
                onClick={() =>
                  (window.location.href = "mailto:support@example.com")
                }
              >
                Email Support
              </Button>
              <Button
                className="w-full bg-purple-500 hover:bg-purple-600"
                onClick={() => (window.location.href = "tel:+1234567890")}
              >
                Call Us
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
