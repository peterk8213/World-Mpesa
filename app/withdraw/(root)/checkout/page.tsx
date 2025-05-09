import React, { Suspense } from "react";
import { WithdrawalConfirmation } from "@/components/WithdrawCheckout";
import {
  InitiateWithdrawData,
  WithdrawRequestCheckout,
  WalletBalanceResponse,
} from "@/types";
import { getWithdrawCheckoutPageData } from "@/lib/wallet/WithdrawCheckoutData";
import dbConnect from "@/lib/mongodb";
import { Wallet } from "@/models/Wallet";
import { redirect } from "next/navigation";
import { Provider } from "@/models/provider";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getWithdrawalDetails(
  InitiateWithdrawData: InitiateWithdrawData
) {
  const { accountId, method, amount, userId } = InitiateWithdrawData;
  const processdata = {
    amount,
    accountId,
    method,
    userId,
  };
  const { orderDetails, accountDetails: accountdetails } =
    await getWithdrawCheckoutPageData({
      amount,
      method,
      accountId,
      userId,
    });

  return {
    processdata,
    orderDetails,
    accountdetails,
  };
}

export default async function WithdrawPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; method: string; account: string }>;
}) {
  const amount = (await searchParams).amount || "0";
  const method = (await searchParams).method;
  const accountId = (await searchParams).account;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  await dbConnect();

  const { userId } = session;

  return (
    <div className="flex flex-col min-h-screen  bg-gray-50 items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <WithdrawAmountPageWrapper
          amount={amount}
          method={method}
          accountId={accountId}
          userId={userId}
        />
      </Suspense>
    </div>
  );
}

async function WithdrawAmountPageWrapper({
  amount,
  method,
  accountId,
  userId,
}: {
  method: string;
  amount: string;
  accountId: string;
  userId: string;
}) {
  const withdrawRequestData = {
    amount,
    method,
    accountId,
    userId,
  };
  const withdrawCheckoutData = await getWithdrawalDetails(withdrawRequestData);
  console.log("withdrawCheckoutData", withdrawCheckoutData);

  return (
    <>
      <WithdrawalConfirmation
        withdrawCheckoutData={withdrawCheckoutData}
        userId={userId}
      />
    </>
  );
}
