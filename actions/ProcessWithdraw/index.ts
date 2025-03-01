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
import { InitiateIntasendPayout } from "@/lib/wallet/payout";
import { Wallet as WalletDataType } from "@/types";
import { revalidatePath } from "next/cache";

interface State {
  success?: boolean;
  error?: string;
  pending?: boolean;
  transactionId?: string;
}

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
  error?: string;
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
        error: "Invalid withdrawal request.",
      };
    }
    return {
      success: true,
      data: wallet,
    };
  } catch (error) {
    console.error("Error verifying withdrawal request:", error);
    return { success: false, error: "Failed to verify withdrawal request." };
  }
};

export async function processWithdrawal(
  prevState: State,
  formData: FormData
): Promise<State> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  try {
    const { userId: userIdFromSession, worldId } = session;
    const { amount, method, userId, accountId } = await getFormData(formData);

    // Validate the withdrawal details
    if (amount < 2) {
      return {
        ...prevState,
        error: "Invalid amount. Amount must be greater than 2 USD.",
        pending: false,
      };
    }

    if (!accountId || !userId || !method || !amount) {
      return {
        ...prevState,
        error: "No credentials provided for withdrawal.",
        pending: false,
      };
    }

    if (userIdFromSession !== userId) {
      return {
        ...prevState,
        error: "Invalid user ID.",
        pending: false,
      };
    }

    await dbConnect();

    // Validate payment account and wallet balance concurrently
    const [WithdrawRequestValid, accountValidation] = await Promise.all([
      verifyWithdrawRequest(userId, amount),
      validatePaymentAccount({ accountId, userId, method }),
    ]);

    if (!WithdrawRequestValid.success) {
      return {
        ...prevState,
        error: WithdrawRequestValid.error || "Invalid withdrawal request.",
        pending: false,
      };
    }

    if (!accountValidation.success) {
      return {
        ...prevState,
        error: accountValidation.error || "Invalid payment account.",
        pending: false,
      };
    }

    // Initiate payout
    const payoutData = await InitiateIntasendPayout({
      amount,
      method,
      phoneNumber: accountValidation.data?.phoneNumber || "",
      accountHolderName: accountValidation.data?.fullName || "",
    });

    if (!payoutData.success) {
      return {
        ...prevState,
        error: payoutData.message || "Failed to initiate payout.",
        pending: false,
      };
    }

    // Process the withdrawal
    const [transaction, updatedWallet] = await Promise.all([
      addTransaction({
        userId,
        amount,
        method,
        walletId: WithdrawRequestValid.data?._id || "",
        worldId,
      }),
      updateWallet({ userId, amount }),
    ]);

    if (!updatedWallet.success) {
      return {
        ...prevState,
        error: "Failed to update wallet.",
        pending: false,
      };
    }

    if (!transaction.success) {
      return {
        ...prevState,
        error: "Failed to create transaction.",
        pending: false,
      };
    }

    // Create M-Pesa payout transaction
    const {
      tracking_id,
      request_reference_id,
      transactions,
      status,
      currency,
      charge_estimate: estimatedCharges,
    } = payoutData.data;

    if (!updatedWallet.data) {
      return {
        ...prevState,
        error: "Wallet data is undefined.",
        pending: false,
      };
    }

    const { _id: walletId } = updatedWallet.data;
    const { _id: transactionId } = transaction.data;

    const newTransaction = await createMpesaPaymentPayout({
      tracking_id,
      request_reference_id,
      transactionAmount: parseFloat(transactions[0].amount),
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
      newTransaction,
    });

    revalidatePath("/home");

    return {
      ...prevState,
      success: true,
      pending: false,
      transactionId: transactionId.toString(),
    };
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return {
      ...prevState,
      error: "An unexpected error occurred. Please try again.",
      pending: false,
    };
  }
}
