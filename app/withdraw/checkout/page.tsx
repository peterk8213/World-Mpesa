import React, { Suspense } from "react";
import WithdrawConfirm from "@/app/withdraw/checkout/withdrawConfirm";
import { processWithdrawal } from "@/app/withdraw/checkout/action";

interface WithdrawPageProps {
  method: string;
  amount: string;
  balance: number;
  processWithdrawal: () => void;
}

export default async function WithdrawPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; method: string }>;
}) {
  const amount = (await searchParams).amount || "0";
  const method = (await searchParams).method;
  const balance = 100;
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white">
        <h1 className="text-center">Confirm Withdrawal</h1>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <WithdrawConfirm
            method={method}
            amount={amount}
            balance={balance}
            processWithdrawal={processWithdrawal}
          />
        </Suspense>
      </main>
    </div>
  );
}
