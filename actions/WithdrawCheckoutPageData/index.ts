"use server";

import { getConversionRate } from "@/actions/GetFiatEquivalent";
import { InitiateWithdrawData } from "@/types";

const getOrderDetails = async ({
  amount,
  method,
  accountId,
}: InitiateWithdrawData) => {
  const fees = parseFloat(amount) * 0.015 + 0.3;
  const { conversionRate } = await getConversionRate();

  const totalAmount = parseFloat(amount) - fees;
  const fiatAmount = totalAmount * conversionRate;
  const estimatedTime = "Instant";
  const walletBalance = 1000;
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
  const accountDetails = await getAccountDetails({ accountId });
  const orderDetails = await getOrderDetails({ amount, method, accountId });

  return {
    orderDetails,
    accountDetails,
  };
}
