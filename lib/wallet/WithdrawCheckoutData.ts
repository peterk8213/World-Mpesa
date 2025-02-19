import { getConversionRate } from "@/lib/wallet/conversion";
import { InitiateWithdrawData } from "@/types";

import { calculateWithdrawFee } from "@/lib/wallet/getFees";
import { PaymentAccount } from "@/models/PaymentAccount";
import { Wallet } from "@/models/Wallet";

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

  const walletBalance = 100;
  const orderDetails = {
    amount,
    fees,
    totalAmount: netAmount,
    walletBalance,

    method,
    fiatAmount,
    conversionRate,
  };

  return orderDetails;
};
const getAccountDetails = async ({
  accountId,
  userId,
}: {
  accountId: string;
  userId: string;
}) => {
  const account = await PaymentAccount.findOne({
    _id: accountId,
    userId,
  }).populate({
    path: "providerId",
    select: "shortname processingTime",
  });
  if (!account) {
    throw new Error("Account not found");
  }

  const { fullName: accountHolderName, phoneNumber, providerId } = account;

  const accountdetails = {
    accountHolderName,
    phoneNumber,
    provider: providerId.shortname,
    estimatedTime: providerId.processingTime,
  };

  return accountdetails;
};

export async function getWithdrawCheckoutPageData({
  amount,
  method,
  accountId,
  userId,
}: {
  amount: string;
  method: string;
  accountId: string;
  userId: string;
}) {
  //resolve the requests concurrently

  const [orderDetails, accountDetails] = await Promise.all([
    getOrderDetails({ amount, method, accountId, userId }),
    getAccountDetails({ accountId, userId }),
  ]);

  return {
    orderDetails,
    accountDetails,
  };
}
