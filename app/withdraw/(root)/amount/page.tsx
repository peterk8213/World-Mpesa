import { Suspense } from "react";

import WithdrawKeypad from "@/components/WithdrawKeypad";
import { WithdrawKeypadProps } from "@/types";

import { getConversionRate } from "@/lib/wallet/conversion";
import { ConversionRate as ConversionRateType } from "@/types";

import { WalletBalanceResponse } from "@/types";

import { getServerSession } from "next-auth";
import { getUserBalance } from "@/lib/wallet/balance";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import dbConnect from "@/lib/mongodb";

export default async function WithdrawAmountPage({
  searchParams,
}: {
  searchParams: Promise<{ method: string; account: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  const { userId } = session;
  ///// connect to the db
  await dbConnect();

  const method = (await searchParams).method;

  const account = (await searchParams).account;

  return (
    <div className="min-h-screen bg-background flex flex-col md:p-10 lg:p-5 md:overflow-auto">
      <main className="flex-grow flex items-center justify-center p-4 mt-20">
        <Suspense fallback={<div>Loading...</div>}>
          <WithdrawAmountPageWrapper
            method={method}
            account={account}
            userId={userId}
          />
        </Suspense>
      </main>
    </div>
  );
}

async function WithdrawAmountPageWrapper({
  method,
  account,
  userId,
}: {
  method: string;
  account: string;
  userId: string;
}) {
  const { data } = await getUserBalance({ userId });
  const conversionRate: ConversionRateType = await getConversionRate();

  return (
    <>
      <WithdrawKeypad
        method={method}
        balance={data?.balance || 0}
        account={account}
        conversionRate={conversionRate}
      />
    </>
  );
}
