"use server";

import { getConversionRate } from "@/lib/wallet/conversion";
import { InitiateWithdrawData } from "@/types";

const getOrderDetails = async ({
  amount,
  method,
  accountId,
}: InitiateWithdrawData) => {
  const fees = parseFloat(amount) * 0.015 + 0.3;
  const { conversionRate } = await getConversionRate();

  const totalAmount = parseFloat(amount) - fees;

  const fiatAmount = parseFloat(totalAmount.toFixed(4)) * conversionRate;
  const estimatedTime = "Instant";
  const walletBalance = 100;
  const orderDetails = {
    amount,
    fees,
    totalAmount,
    walletBalance,
    estimatedTime,
    method,
    fiatAmount,
    conversionRate,
  };
  console.log("orderDetails done");
  return orderDetails;
};
const getAccountDetails = async ({ accountId }: { accountId: string }) => {
  const accountHolderName = "John Doe";
  const phoneNumber = "+254 712 345 678";
  const provider = "mpesa";
  const accountdetails = {
    accountHolderName,
    phoneNumber,
    provider,
  };

  return accountdetails;
};

export async function getWithdrawCheckoutPageData({
  amount,
  method,
  accountId,
}: {
  amount: string;
  method: string;
  accountId: string;
}) {
  //resolve the requests concurrently

  const [orderDetails, accountDetails] = await Promise.all([
    getOrderDetails({ amount, method, accountId }),
    getAccountDetails({ accountId }),
  ]);

  return {
    orderDetails,
    accountDetails,
  };
}
