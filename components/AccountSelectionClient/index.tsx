"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import WithdrawAccountCard from "@/components/PaymentAccountCard";
import { PaymentAccount as PaymentAccountType } from "@/types";
import FloatingAddButton from "@/components/FloatingAddAccount";

import { AddPaymentAccountForm } from "@/components/AddPaymentAccount";

/// motion() is deprecated. Use motion.create() instead.
const MotionButton = motion.create(Button);
// const MotionButton = motion(Button);

interface AccountSelectionClientProps {
  method: string;
  accounts: PaymentAccountType[];
}

export default function AccountSelectionClient({
  method,
  accounts,
}: AccountSelectionClientProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = () => {
    if (!selectedAccount) {
      return;
    }
    if (!method) {
      return;
    }
    router.push(
      `/withdraw/amount?method=${encodeURIComponent(
        method
      )}&account=${encodeURIComponent(selectedAccount)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-medium mb-8">Select Payment Method</h1>
          <motion.div
            className="space-y-4  "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {accounts.length > 0 &&
              accounts.map((account, index) => (
                <motion.div
                  key={account._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <WithdrawAccountCard
                    account={account}
                    selected={selectedAccount === account._id}
                    onSelect={() => setSelectedAccount(account._id)}
                  />
                </motion.div>
              ))}
          </motion.div>
        </div>
      </main>
      <div className=" fixed bottom-[7rem]  z-10 right-12">
        <FloatingAddButton />
      </div>

      <div className="fixed bottom-5 left-0 right-0 p-4 bg-background border-t">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MotionButton
            className="w-full text-xl rounded-lg py-6"
            onClick={handleSubmit}
            disabled={!selectedAccount}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Continue
          </MotionButton>
        </motion.div>
      </div>
    </div>
  );
}
