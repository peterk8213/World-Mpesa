import React, { Suspense } from "react";
import { WithdrawalConfirmation } from "@/components/WithdrawCheckout";
import { InitiateWithdrawData, WithdrawRequestCheckout } from "@/types";
import { getWithdrawCheckoutPageData } from "@/actions/WithdrawCheckoutPageData";

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

  const balance = 100;
  const withdrawRequestData = {
    amount,
    method,
    accountId,
  };
  const withdrawCheckoutData = await getWithdrawalDetails(withdrawRequestData);

  return (
    <div className="flex flex-col min-h-screen  bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <WithdrawalConfirmation withdrawCheckoutData={withdrawCheckoutData} />
      </Suspense>
    </div>
  );
}
