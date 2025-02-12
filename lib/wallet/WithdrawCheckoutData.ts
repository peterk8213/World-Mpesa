import { getConversionRate } from "@/lib/wallet/conversion";
import { InitiateWithdrawData } from "@/types";

import { calculateWithdrawFee } from "@/lib/wallet/getFees";

const getOrderDetails = async ({
  amount: userAmount,
  method,
  accountId,
}: InitiateWithdrawData) => {
  const amount = parseFloat(userAmount);
  const fees = calculateWithdrawFee({ amount, method });
  const { conversionRate } = await getConversionRate();

  const { netAmount, totalFee } = fees;

  const fiatAmount = netAmount * conversionRate;
  const estimatedTime = "Instant";
  const walletBalance = 100;
  const orderDetails = {
    amount,
    fees,
    totalAmount: netAmount,
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
