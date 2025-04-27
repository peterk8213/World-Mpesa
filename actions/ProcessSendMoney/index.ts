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
import { revalidatePath, revalidateTag } from "next/cache";
import MpesaPayment from "@/models/MpesaPayment";

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

  phoneNumber: string;
  description: string;
}> => {
  const amount = formData.get("amount") as string;
  const method = formData.get("method") as string;

  const phoneNumber = formData.get("phone") as string;
  const description = formData.get("description") as string;
  return {
    amount: parseFloat(amount),
    method,

    phoneNumber,
    description,
  };
};
const addSendTransaction = async function ({
  userId,
  amount,
  method,
  phoneNumber,
  description,
  reference,
  walletId,
  worldId,
}: {
  userId: string;
  amount: number;
  method: string;
  phoneNumber: string;
  description: string;
  reference: string;
  walletId: string;
  worldId: string;
}): Promise<{
  success: boolean;
  error?: any;
  data?: any;
}> {
  try {
    const newTransaction = await Transaction.create({
      userId,
      walletId,
      worldId,
      amount,
      phoneNumber,
      reference,
      method: "mpesa",
      type: "send",
      status: "pending",
      description: description || "Mpesa send transaction",
      meta: {},
    });
    return {
      success: true,
      data: newTransaction,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

const createMpesaSendPayout = async function ({
  tracking_id,
  request_reference_id,
  transactionAmount,
  status,
  currency,
  estimatedCharges,
  transactionId,
  reference,

  userId,
  walletId,
  phoneNumber,
}: {
  tracking_id: string;
  request_reference_id: string;
  transactionAmount: number;
  status: "pending" | "completed" | "failed";
  currency: string;
  estimatedCharges: number;
  transactionId: string;
  reference: string;

  userId: string;
  walletId: string;
  phoneNumber: string;
}): Promise<{
  success: boolean;
  error?: any;
  data?: any;
}> {
  try {
    const newPayment = await MpesaPayment.create({
      tracking_id,
      request_reference_id,
      transactionAmount,
      status: status === "completed" ? "completed" : "pending",
      currency,
      estimatedCharges,
      transactionId,
      reference,

      userId,
      walletId,
      phoneNumber,
    });
    if (!newPayment) {
      throw new Error("Payment not created.");
    }

    return {
      success: true,
      data: newPayment,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

export async function ProcessSendMoney(
  prevState: State,
  formData: FormData
): Promise<State> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  try {
    const { amount, method, phoneNumber, description } = await getFormData(
      formData
    );
    const { userId, worldId } = session;
    if (!userId || !method || !amount || !phoneNumber) {
      return {
        ...prevState,
        error: "Please Provide all required fields",
        pending: false,
      };
    }

    const sendRequestValid = await verifyWithdrawRequest(userId, amount);

    /// return error if request is invalid i.e insufficient funds/ frozen account
    if (!sendRequestValid.success) {
      return {
        ...prevState,
        error: sendRequestValid.error || "Invalid withdrawal request.",
        pending: false,
      };
    }

    // Initiate payout
    const payoutData = await InitiateIntasendPayout({
      amount,
      method,
      phoneNumber,
      description,
    });

    if (!payoutData.success) {
      return {
        ...prevState,
        error: payoutData.message || "Failed to initiate payout.",
        pending: false,
      };
    }

    ////// process transaction resolve the two simultaneously

    const uuid = crypto.randomUUID().replace(/-/g, "");

    const [transaction, updatedWallet] = await Promise.all([
      addSendTransaction({
        userId,
        amount,
        method,
        phoneNumber,
        description,
        reference: uuid,
        walletId: sendRequestValid.data?._id || "",
        worldId,
      }),
      updateWallet({ userId, amount }),
    ]);

    // Create M-Pesa payout transaction

    if (!updatedWallet.success) {
      console.log("Failed to update wallet.");
      return {
        ...prevState,
        error: "Failed to update wallet.",
        pending: false,
      };
    }

    if (!transaction.success) {
      console.log("Failed to create transaction.");
      return {
        ...prevState,
        error: "Failed to create transaction.",
        pending: false,
      };
    }

    const { _id: walletId } = updatedWallet.data;
    const { _id: transactionId } = transaction.data;
    const {
      tracking_id,
      request_reference_id,
      transactions,
      status,
      currency,
      charge_estimate: estimatedCharges,
    } = payoutData.data;

    const payment = await createMpesaSendPayout({
      tracking_id,
      request_reference_id,
      transactionAmount: parseFloat(transactions[0].amount),
      status,
      currency,
      estimatedCharges,
      transactionId,
      reference: uuid,

      userId,
      walletId,
      phoneNumber,
    });

    revalidatePath("/profile /history /send /home");

    return {
      ...prevState,
      success: true,
      transactionId: transactionId.toString(),
    };
  } catch (error) {
    console.error("Error processing send money:", error);
    return { ...prevState, success: false, error: "Failed to send money." };
  }
}

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
        error: "Invalid amount. Insufficient funds.",
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
