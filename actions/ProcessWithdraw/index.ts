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

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Wallet as WalletDataType } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { initiateManualPayout } from "@/lib/wallet/manualpayout";

import { sendNotification } from "@/lib/notifications";
import { WorldcoinTransaction } from "@/models/WldTransaction";
import { Provider } from "@/models/provider";

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

export const verifyWithdrawRequest = async (
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
    const WithdrawRequestValid = async () => {
      if (wallet.balance < amount) {
        return false;
      }
      if (wallet.isFrozen === true) {
        return false;
      }
      return true;
    };
    const WithdrawRequestValidResponse = await WithdrawRequestValid();

    if (!WithdrawRequestValidResponse) {
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
    if (!(amount >= 1)) {
      return {
        ...prevState,
        error: "Invalid amount. Amount must be greater than 1 USD.",
        pending: false,
      };
    }

    if (!accountId || !userId || !method || !amount) {
      return {
        ...prevState,
        error: " Please provide all required fields.",
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
    if (!accountValidation.data) {
      return {
        ...prevState,
        error: accountValidation.error || "Invalid payment account.",
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

    const payout = await initiateManualPayout({
      userId,
      transactionId: transaction.data._id,
      amount,
      phoneNumber: accountValidation.data.phoneNumber,
      fullname: accountValidation.data.fullName,
      description: "Withdrawal",
    });

    if (!payout.success || !payout.data) {
      console.log("Failed to initiate payout.");

      return {
        ...prevState,
        error: "Failed to initiate payout.",
        pending: false,
      };
    }

    console.log("Withdrawal processed and payout initiated", {
      transactionId: transaction.data._id,
      payoutId: payout.data._id,
      amount,
      kesEquivalent: payout.data.amountinKes,
    });

    revalidatePath("/home");
    revalidatePath("/history");

    const user = await WorldcoinTransaction.findOne({
      userId: userIdFromSession,
    }).populate("userId");

    if (!user) {
      return {
        ...prevState,
        success: true,
        pending: false,
        transactionId: transaction.data._id.toString(),
      };
    }

    if (!user.userId.notifications || user.userId.notifications === false) {
      console.log("User has disabled notifications.", user);
      return {
        ...prevState,
        success: true,
        pending: false,
        transactionId: transaction.data._id.toString(),
      };
    }

    const { fromWalletAddress: walletAddress } = user;

    console.log("Sending notification to user", {
      walletAddress,
      amountinKes: payout.data.amountinKes,
    });

    if (!walletAddress) {
      return {
        ...prevState,
        success: true,
        pending: false,
        transactionId: transaction.data._id.toString(),
      };
    }

    const notificationResponse = await sendNotification({
      amountinKes: payout.data.amountinKes,
      phoneNumber: accountValidation.data.phoneNumber,
      walletAddress: walletAddress,
      fullName: accountValidation.data.fullName,
      appId: process.env.APP_ID || "",
      title: "Withdrawal Action",
      mini_app_path: `worldapp://mini-app?app_id=${process.env.APP_ID}`,
      apiKey: process.env.DEV_PORTAL_API_KEY || "",
    });

    if (!notificationResponse.success) {
      console.log("Failed to send notification", notificationResponse.error);
    }

    return {
      ...prevState,
      success: true,
      pending: false,
      transactionId: transaction.data._id.toString(),
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
