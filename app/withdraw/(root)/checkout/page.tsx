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

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getWithdrawalDetails(
  InitiateWithdrawData: InitiateWithdrawData
) {
  const { accountId, method, amount } = InitiateWithdrawData;
  const processdata = {
    amount,
    accountId,
    method,
  };
  const { orderDetails, accountDetails: accountdetails } =
    await getWithdrawCheckoutPageData({
      amount,
      method,
      accountId,
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
