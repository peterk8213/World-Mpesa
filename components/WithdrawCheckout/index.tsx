"use client";

import { Phone, HandCoins } from "lucide-react";
import { processWithdrawal } from "@/actions/ProcessWithdraw";
import { WithdrawRequestCheckout } from "@/types";
import { InfoItem } from "@/components/InfoItem";
import Form from "next/form";

import { WithdrawCheckoutpage } from "@/components/WithdrawCheckoutData";
import { WithdrawConfirmButton } from "@/components/WithdrawCofirmButton";

export function WithdrawalConfirmation({
  withdrawCheckoutData,
  userId,
}: {
  withdrawCheckoutData: WithdrawRequestCheckout;
  userId: string;
}) {
  const {
    processdata: { amount, accountId, method },
  } = withdrawCheckoutData;

  return (
    <div className="flex flex-col  w-full ">
      <WithdrawCheckoutpage withdrawCheckoutData={withdrawCheckoutData} />

      <div className="fixed bottom-0 left-0 right-0 p-4 z-10">
        <div className="max-w-md mx-auto space-y-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl   shadow-lg">
            <WithdrawConfirmButton
              accountId={accountId}
              amount={amount}
              method={method}
              userId={userId}
              processWithdrawal={processWithdrawal}
            />
          </div>
          {/* <button className="w-full flex items-center justify-center text-gray-600 hover:text-black transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            Contact Support
          </button> */}
        </div>
      </div>
    </div>
  );
}
