"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
import WithdrawAccountCard from "@/components/PaymentAccountCard";
import { PaymentAccount as PaymentAccountType } from "@/types";
import FloatingAddButton from "@/components/FloatingAddAccount";

import { AddPaymentAccountForm } from "@/components/AddPaymentAccount";
import { toastLoading } from "@/lib/toast";

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
    if (selectedAccount) {
      toastLoading(" Processing...");
    }
    router.push(
      `/withdraw/amount?method=${encodeURIComponent(
        method
      )}&account=${encodeURIComponent(selectedAccount)}`
    );
  };

  return (
    <div className="min-h-screen  pb-5">
      <main className="container ">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-medium p-4">Select Payment Account</h1>
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
        <div className="fixed bottom-5 left-0 right-0 p-4 bg-transparent ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <MotionButton
              onClick={handleSubmit}
              className="text-xl rounded-lg py-6 mx-auto w-full"
              fullWidth
              disabled={!selectedAccount}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Continue
            </MotionButton>
          </motion.div>
        </div>
      </main>
      <div className=" fixed bottom-[7rem]  z-10 right-12">
        <FloatingAddButton />
      </div>
    </div>
  );
}
