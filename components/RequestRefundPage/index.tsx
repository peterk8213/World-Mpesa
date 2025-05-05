"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@worldcoin/mini-apps-ui-kit-react/Input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AddressDrawer } from "@/components/AddressDrawer";
import { ConfirmDialog } from "@/components/ConfirmRefundDialog";
import { AddressCard } from "@/components/WalletAddressCard";
import { SuccessPage } from "@/components/RefundSuccessPage";
import { Button } from "@/components/ui/button";
import { toastError, toastLoading, toastSuccess } from "@/lib/toast";
import { SubmitRefundParams, RefundResponse } from "@/types";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const mockAddresses = [
  {
    id: "1",
    address: "0xf0...ff3e",
    fullAddress: "0xf012345678901234567890123456789012345ff3e",
    label: "Known address",
    icon: "binance",
  },
];

interface Address {
  id: string;
  address: string;
  fullAddress: string;
  label: string;
  icon: string;
}

const MotionButton = motion.create(Button);

function isValidWorldChainAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

const isAmountValid = ({
  amount,
  Balance,
  addresses,
}: {
  amount: string;
  Balance: number;
  addresses: Address[] | undefined;
}) => {
  const parsedAmount = parseFloat(amount);
  return !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= Balance;
};

export function RefundRequestPage({
  Balance,
  submitRefundRequest,
}: {
  Balance: number;
  submitRefundRequest: (params: SubmitRefundParams) => Promise<RefundResponse>;
}) {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState(
    addresses[0]?.id || ""
  );
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("WLD");
  const [isValidAddress, setIsValidAddress] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const handleMaxAmount = () => {
    setAmount(Balance.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      toastError(`Please select a Worldchain wallet address`);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toastError("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > Balance) {
      toastError("Amount exceeds available balance");
      return;
    }
    if (parseFloat(amount) < 1) {
      toastError("Minimum amount is 1");
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirmTransaction = async () => {
    // In a real app, you would submit the transaction here
    console.log("Transaction confirmed", {
      address: addresses.find((a) => a.id === selectedAddress)?.fullAddress,
      amount,
      currency,
    });
    setIsDialogOpen(false);

    // call the server Action to submit the refund request
    if (!addresses.find((a) => a.id === selectedAddress)?.fullAddress) {
      toastError("Please select a Worldchain wallet address");
      return;
    }
    const response = await submitRefundRequest({
      amount: parseFloat(amount),
      walletAddress:
        addresses.find((a) => a.id === selectedAddress)?.fullAddress || "",

      currency,
    });
    if (!response) {
      toastError("Failed to submit refund request");
      return;
    }
    if (response.error) {
      toastError(response.error);
      return;
    }
    if (response.details) {
      toastError(response.details.join(", "));
      return;
    }
    if (response.success && response.data) {
      toastSuccess("Refund request submitted successfully");
      router.push(` /refund/${response.data.id}`);
    } else {
      toastError("Failed to submit refund request");
      return;
    }
  };

  const handleAddNewAddress = (newAddress: string) => {
    // Create a new address object
    const newAddressObj = {
      id: `new-${Date.now()}`,
      address: `${newAddress.substring(0, 6)}...${newAddress.substring(
        newAddress.length - 4
      )}`,
      fullAddress: newAddress,
      label: "Custom address",
      icon: "worldchain",
    };

    // Update addresses and select the new one
    setAddresses([...addresses, newAddressObj]);
    setSelectedAddress(newAddressObj.id);
  };

  if (isSuccess) {
    // return (
    //   <SuccessPage
    //     // transactionId={transactionId}
    //     amount={amount}
    //     currency={currency}
    //     address={
    //       addresses.find((a) => a.id === selectedAddress)?.fullAddress || ""
    //     }
    //     onDone={() => {
    //       setIsSuccess(false);
    //       setAmount("");
    //       setCurrency("WLD");
    //     }}
    //   />
    // );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white p-4 border-b">
        <div className="flex items-center">
          <Link href="/" className="p-2 rounded-full bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold ml-4">Request Refund</h1>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <section>
            <h2 className="text-3xl font-bold mb-2">Address</h2>
            <p className="text-gray-500 mb-4">
              Select the Worldchain wallet address where you want to transfer
            </p>

            <div className="space-y-2">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  id={addr.id}
                  address={addr.address}
                  fullAddress={addr.fullAddress}
                  label={addr.label}
                  selected={selectedAddress === addr.id}
                  onSelect={setSelectedAddress}
                />
              ))}

              <div className="flex items-center justify-end w-full">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-2 p-3  "
                >
                  <AddressDrawer onAddressSelected={handleAddNewAddress} />
                </motion.button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                <strong>IMPORTANT:</strong> Only Worldchain addresses are
                supported. Using any other blockchain address will result in
                permanent loss of funds.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Amount</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="mt-1 ">
                  <Input
                    id="amount"
                    type="number"
                    name="amount"
                    required
                    min={0}
                    step={0.01}
                    max={Balance}
                    isValid={isValidAmount}
                    placeholder="0.00 "
                    value={amount}
                    error={!isValidAmount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setIsValidAmount(isAmountValid(e.target.value));
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-4 px-4">
                  <div>
                    <span className="text-sm text-gray-500">{Balance} USD</span>
                  </div>
                  <div>
                    <button
                      onClick={handleMaxAmount}
                      className="text-sm text-blue-600 font-medium"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="currency-type">Receive in</Label>
                <RadioGroup
                  id="currency-type"
                  value={currency}
                  onValueChange={setCurrency}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="WLD" id="wld" />
                    <Label htmlFor="wld" className="cursor-pointer">
                      WLD
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USDCE" id="usdce" />
                    <Label htmlFor="usdce" className="cursor-pointer">
                      USDCE
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </section>
          <div className=" z-10 bottom-6 px-5 left-0 right-0  p-4 border-t lg:mx-auto w-auto">
            <MotionButton
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full  px-6 bg-black text-white rounded-full font-medium mt-8 "
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              size={"lg"}
              onClick={handleSubmit}
            >
              <div className="">
                <p className="text-md font-medium text-white flex items-center gap-2 p-5">
                  Request Refund
                </p>
              </div>
            </MotionButton>
          </div>
        </motion.div>
      </main>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        address={
          addresses.find((a) => a.id === selectedAddress)?.fullAddress || ""
        }
        amount={amount}
        currency={currency}
        onConfirm={handleConfirmTransaction}
      />
    </div>
  );
}
