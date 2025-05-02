"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Wallet2,
  Smartphone,
  HelpCircle,
  X,
  Headset,
} from "lucide-react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";

import { toastError, toastLoading, toastSuccess } from "@/lib/toast";

import { PhoneField } from "@worldcoin/mini-apps-ui-kit-react/PhoneField";
import { ProcessSendMoney } from "@/actions/ProcessSendMoney";
import { useActionState } from "react";
import { isValid } from "date-fns";
import { formatWithoutRounding } from "@/lib/formatBalance";

interface State {
  success?: boolean;
  error?: string;
  pending?: boolean;
  transactionId?: string;
}

export function SendMoneyPage({
  walletBalance,
  userId,
}: {
  walletBalance: number;
  userId: string;
}) {
  const [selectedOption, setSelectedOption] = useState<
    "mpesa" | "airtel" | null
  >(null);
  const [phoneNumber, setPhoneNumber] = useState("254");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const[fullname,setFullname]=useState("")
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  //  assign wallet balance to a variable balance
  const balance = parseFloat(formatWithoutRounding(walletBalance, 2));

  const router = useRouter();

  const handleAmountChange = (value: string) => {
    // Allow any positive number to be entered, validation will be shown instead of prevented
    if (!value || Number.parseFloat(value) >= 0) {
      setAmount(value);
    }
  };

  const setMaxAmount = () => {
    setAmount(balance.toString());
  };

  const isPhoneValid = () => {
    //// a regex that checks if the phone number is valid generate one
    // Kenyan phone number regex: Supports +2547XXXXXXXX or 07XXXXXXXX format
    const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
    const phone = phoneNumber;

    if (!phoneRegex.test(phone)) {
      return false;
    }
    return true;
  };

  const isAmountValid =
    amount &&
    Number.parseFloat(amount) >= 1 &&
    Number.parseFloat(amount) <= balance;
  const amountError =
    amount &&
    (Number.parseFloat(amount) < 1
      ? "Amount must be at least 1"
      : Number.parseFloat(amount) > balance
      ? "Amount exceeds your available balance"
      : null);

  ///////// state for sending the request to a server function keeps state in the p[age]

  const [state, formAction, isPending] = useActionState<State>(
    ProcessSendMoney,
    {
      success: false,
    }
  );



  useEffect(() => {
    if (isPending) {
      toastLoading("Processing ⚡⚡");
    }
    // if (state.success) {
    //   router.push("/withdraw/success");
    // }

    if (state.error) {
      toastError(state.error);
      state.error = undefined;
    }
    if (state.success === true) {
      toastSuccess("Withdrawal Successful  redirecting 🚥🚧");
      router.push(`/withdraw/success?transactionId=${state.transactionId}`);

      state.success = false;
      console.log(state.transactionId);

      return;
    }
    if (state.error) {
      toastError(state.error);
      state.error = undefined;
    }
    return;
  }, [isPending]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      <div className="mx-auto ">
        {/* Main Card */}
        <div className="space-y-8 rounded-3xl border border-white/20 bg-white/60 p-6 shadow-2xl backdrop-blur-xl ">
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
                <motion.button
                  onClick={() => {
                    setSelectedOption("mpesa");
                  }}
                  className={`group overflow-hidden rounded-2xl border-2 border-black p-4 transition-all hover:shadow-lg ${
                    selectedOption === "mpesa"
                      ? "border-green-500 bg-green-50/50"
                      : "border-white/30 bg-white/40 hover:border-green-200"
                  }`}
                  initial={{ boxShadow: "0 0 0 rgba(0, 0, 0, 0)", y: 0 }}
                  animate={
                    selectedOption === "mpesa"
                      ? {}
                      : {
                          boxShadow: [
                            "0 0 0 rgba(0, 0, 0, 0)",
                            "0 4px 12px rgba(0, 0, 0, 0.05)",
                            "0 0 0 rgba(0, 0, 0, 0)",
                          ],
                          y: [2, 0, 2],
                        }
                  }
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`rounded-full p-2 ${
                        selectedOption === "mpesa"
                          ? "bg-green-100"
                          : "bg-white/80"
                      }`}
                    >
                      <Wallet2
                        className={`h-6 w-6 ${
                          selectedOption === "mpesa"
                            ? "text-green-500"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">M-Pesa</p>
                      <p className="text-xs text-gray-500">Instant Transfer</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setSelectedOption("airtel");
                  }}
                  className={`group overflow-hidden rounded-2xl border-2 p-4 transition-all hover:shadow-lg ${
                    selectedOption === "airtel"
                      ? "border-red-600 bg-red-50/50"
                      : "border-white/30 bg-white/40 hover:border-red-200"
                  }`}
                  initial={{ boxShadow: "0 0 0 rgba(0, 0, 0, 0)", y: 0 }}
                  animate={
                    selectedOption === "airtel"
                      ? {}
                      : {
                          boxShadow: [
                            "0 0 0 rgba(0, 0, 0, 0)",
                            "0 4px 12px rgba(0, 0, 0, 0.05)",
                            "0 0 0 rgba(0, 0, 0, 0)",
                          ],
                          y: [2, 0, 2],
                        }
                  }
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
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
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">Airtel</p>
                      <p className="text-xs text-gray-500">Quick & Easy</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Amount
                </Label>
              </div>

              <div className="space-y-2">
                <div
                  className="flex h-14 w-full items-center rounded-2xl border-2 bg-white/40 backdrop-blur-sm transition-all hover:border-gray-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black
                  ${amountError ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500' : 'border-white/60'}"
                >
                  <div className="flex h-full items-center px-4 text-gray-500">
                    $
                  </div>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      handleAmountChange(e.target.value);
                    }}
                    className="h-full flex-1 border-0 bg-transparent text-lg focus:outline-none focus:ring-0"
                    placeholder="0.00"
                  />
                  {amount && (
                    <div className="flex items-center gap-2 p-2">
                      <button
                        onClick={() => {
                          setAmount("");
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        type="button"
                        aria-label="Clear amount"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="w-2"></div>
                </div>

                {amountError && (
                  <p className="text-sm text-red-500">{amountError}</p>
                )}

                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/40 p-3 text-sm backdrop-blur-sm">
                  <span className="text-gray-500">Available Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      ${balance.toLocaleString()}
                    </span>
                    <button
                      onClick={setMaxAmount}
                      className="text-xs font-medium underline text-black/70 hover:text-black"
                    >
                      Max
                    </button>
                  </div>
                </div>
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
              <div className="flex h-14 w-full items-center rounded-2xl ">
                <PhoneField
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  countrySelectorMode="drawer"
                  required
                  min={10}
                  hideDialCode
                  error={!isPhoneValid() && isEditing}
                  defaultCountryCode="KE"
                  isValid={isPhoneValid()} // check if the phone number is valid
                  value={phoneNumber}
                  onChange={(value) => {
                    setPhoneNumber(value);
                    setIsEditing(true);
                  }}
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
              <div className="flex rounded-2xl border border-white/60 bg-white/40 backdrop-blur-sm transition-all hover:border-gray-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] w-full resize-none border-0 bg-transparent p-3 focus:outline-none focus:ring-0"
                  placeholder="What's this payment for?"
                />
                {description && (
                  <div className="p-2">
                    <button
                      onClick={() => setDescription("")}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      type="button"
                      aria-label="Clear description"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Confirmation */}
            <div className="rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-sm mb-12">
              <label className="flex cursor-pointer items-start gap-3">
                <div className="mt-1 flex h-5 w-5 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={phoneConfirmed}
                    onChange={() => setPhoneConfirmed(!phoneConfirmed)}
                    className="peer absolute h-5 w-5 cursor-pointer opacity-0"
                  />
                  <div className="absolute h-5 w-5 rounded border border-gray-300 bg-white transition-all peer-checked:border-black peer-checked:bg-black"></div>
                  {phoneConfirmed && (
                    <Check className="absolute h-3.5 w-3.5 text-white" />
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

            <div className="fixed bottom-0 left-0 right-0 p-4 z-10">
              {/* Submit Button */}

              {/* for me to use form  and server actions i will need to hide the user input in inputs hidden. that will have the data needeed from that route
               */}

              <form action={formAction}>
                <input type="hidden" name="phone" value={phoneNumber} />
                <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="description" value={description} />
                <input
                  type="hidden"
                  name="method"
                  value={selectedOption || ""}
                />

                <Button
                  className={` group h-14 overflow-hidden w-full rounded-2xl ${
                    !phoneNumber || !isAmountValid || !phoneConfirmed
                      ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200"
                      : "bg-black hover:bg-gray-800"
                  }`}
                  disabled={
                    !phoneNumber ||
                    !isAmountValid ||
                    !phoneConfirmed ||
                    isPending ||
                    !isPhoneValid() ||
                    !selectedOption
                  }
                  type="submit"
                  fullWidth
                >
                  <span className="flex items-center justify-center gap-2 text-xl">
                    Continue
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setShowSupport(!showSupport)}
          className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/60 shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <HelpCircle className="h-6 w-6 text-black" />
        </motion.button>
      </div>

      {/* Support Dialog */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Need Help?
              </h3>
              <button
                onClick={() => setShowSupport(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
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
                variant="tertiary"
                className="w-full rounded-xl border-gray-200 bg-white hover:bg-gray-50"
                onClick={() =>
                  (window.location.href = "mailto:support@example.com")
                }
              >
                Email Support
              </Button>
              <Button
                className="w-full rounded-xl bg-black hover:bg-gray-800"
                onClick={() => (window.location.href = "tel:+1234567890")}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Call Us</span>
                  <Headset className="h-4 w-4 mr-2" />
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
