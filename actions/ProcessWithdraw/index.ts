"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Wallet } from "@/models/Wallet";
import { PaymentAccount } from "@/models/PaymentAccount";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Transaction } from "@/models/Transaction";
import { PaymentAccount as PaymentAccountType } from "@/types";

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

const validatePaymentAccount = async ({
  accountId,
  userId,
  method,
}: {
  accountId: string;
  userId: string;
  method: string;
}): Promise<{
  success: boolean;
  error?: string;
  data?: PaymentAccountType;
}> => {
  const account: PaymentAccountType =
    await PaymentAccount.getPaymentAccountById(accountId);
  if (!account) {
    throw new Error("Payment account not found.");
  }
  if (account.provider && account.provider._id !== method) {
    return {
      success: false,
      error: "Invalid payment method",
    };
  }
  return {
    success: true,
    data: account,
  };
};

const verifyWithdrawRequest = async (userId: string, amount: number) => {
  const wallet = await Wallet.getWalletBalanceByUserId(userId);
  if (!wallet) {
    throw new Error("Wallet not found.");
  }
  return wallet.balance >= amount;
};

const addTransaction = async ({
  userId,
  amount,
  method,
  walletId,
}: {
  userId: string;
  amount: number;
  method: string;
  walletId: string;
}) => {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  const newTransaction = await Transaction.createMpesaTransaction({
    userId,
    amount,
    method,
    walletId,
    reference: uuid,
  });
  if (!newTransaction) {
    throw new Error("Transaction not created.");
  }
  return newTransaction;
};

const updateWallet = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}) => {
  const wallet = await Wallet.withdraw({ userId, amount });
  if (!wallet) {
    throw new Error("Wallet not found.");
  }
  return wallet;
};

export async function processWithdrawal(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  try {
    const { userId: userIdFromSession } = session;
    const { amount, method, userId, accountId } = await getFormData(formData);

    await dbConnect();

    // Validate the withdrawal details
    if (!accountId || !userId || !method || !amount) {
      throw new Error("No credentials provided for withdrawal.");
    }
    if (userIdFromSession !== userId) {
      throw new Error("Invalid user ID.");
    }

    // Validate payment account and wallet balance concurrently
    const [isBalanceValid, accountValidation] = await Promise.all([
      verifyWithdrawRequest(userId, amount),
      validatePaymentAccount({ accountId, userId, method }),
    ]);

    if (!isBalanceValid) {
      throw new Error("Insufficient funds.");
    }
    if (!accountValidation.success) {
      throw new Error(accountValidation.error || "Invalid payment account.");
    }

    // Process the withdrawal
    const [transaction, updatedWallet] = await Promise.all([
      addTransaction({ userId, amount, method, walletId: accountId }),
      updateWallet({ userId, amount }),
    ]);

    console.log("Withdrawal processed successfully:", {
      transaction,
      updatedWallet,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    throw new Error("Failed to process withdrawal. Please try again.");
  }
}
