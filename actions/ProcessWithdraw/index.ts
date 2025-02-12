"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";

import {
  addTransaction,
  validatePaymentAccount,
  updateWallet,
  createMpesaPaymentPayout,
} from "@/lib/wallet/withdraw";

import { Wallet } from "@/models/Wallet";
import { PaymentAccount } from "@/models/PaymentAccount";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Transaction } from "@/models/Transaction";
import {
  PaymentAccount as PaymentAccountType,
  Wallet as WalletDataType,
} from "@/types";

import { InitiateIntasendPayout } from "@/lib/wallet/payout";

const getFormData = async (
  formData: FormData
): Promise<{
  amount: number;
  method: string;
  userId: string;
  accountId: string;
}> => {
  const amount = formData.get("amount") as string;
  const method = formData.get("method") as string;
  const userId = formData.get("userId") as string;
  const accountId = formData.get("accountId") as string;
  return { amount: parseFloat(amount), method, userId, accountId };
};

const verifyWithdrawRequest = async (
  userId: string,
  amount: number
): Promise<{
  success: boolean;
  error?: any;
  data?: WalletDataType;
}> => {
  try {
    const wallet = await Wallet.getWalletBalanceByUserId(userId);
    if (!wallet) {
      return {
        success: false,
        error: "Wallet not found.",
      };
    }
    const WithdrawRequestValid = wallet.verifyWithdrawRequest(amount);
    if (!WithdrawRequestValid) {
      return {
        success: false,
        error: "invalid withdrawal request",
      };
    }
    return {
      success: true,

      data: wallet,
    };
  } catch (error) {
    console.error("Error verifying withdrawal request:", error);
    return { success: false, error };
  }
};

export async function processWithdrawal(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  try {
    const { userId: userIdFromSession } = session;
    const { amount, method, userId, accountId } = await getFormData(formData);

    if (amount < 2) {
      throw new Error("Invalid amount. Amount must be greater than 2 usd.");
    }

    // Validate the withdrawal details
    if (!accountId || !userId || !method || !amount) {
      throw new Error("No credentials provided for withdrawal.");
    }
    if (userIdFromSession !== userId) {
      throw new Error("Invalid user ID.");
    }
    await dbConnect();

    // Validate payment account and wallet balance concurrently
    const [WithdrawRequestValid, accountValidation] = await Promise.all([
      verifyWithdrawRequest(userId, amount),
      validatePaymentAccount({ accountId, userId, method }),
    ]);

    if (!WithdrawRequestValid.success) {
      throw new Error(
        WithdrawRequestValid.error || "Invalid withdrawal request."
      );
    }

    if (!accountValidation.success) {
      throw new Error(accountValidation.error || "Invalid payment account.");
    }

    // Process the withdrawal
    const [transaction, updatedWallet] = await Promise.all([
      addTransaction({ userId, amount, method, walletId: accountId }),
      updateWallet({ userId, amount }),
    ]);

    const payoutData = await InitiateIntasendPayout({
      fullname: "john doe",
      amount,
    });

    if (!payoutData.success) {
      throw new Error(
        payoutData.message || "Failed to initiate payout.",
        payoutData.error
      );
    }
    const {
      tracking_id,
      request_reference_id,
      transactionAmount,
      status,
      currency,
      estimatedCharges,
    } = payoutData.data;

    if (!updatedWallet.data) {
      throw new Error("Failed to update wallet.");
    }
    if (!transaction.data) {
      throw new Error("Failed to update wallet.");
    }
    const { _id: walletId } = updatedWallet.data;

    const { _id: transactionId } = transaction.data;

    const newTransaction = await createMpesaPaymentPayout({
      tracking_id,
      request_reference_id,
      transactionAmount,
      status,
      currency,
      estimatedCharges,
      transactionId,
      paymentAccountId: accountId,
      userId,
      walletId,
    });

    console.log("Withdrawal processed successfully:", {
      transaction,
      updatedWallet,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
  }
}
