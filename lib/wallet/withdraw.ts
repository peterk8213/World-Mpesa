import { Wallet } from "@/models/Wallet";
import { PaymentAccount } from "@/models/PaymentAccount";

import MpesaPayment from "@/models/MpesaPayment";

import { Transaction } from "@/models/Transaction";
import {
  PaymentAccount as PaymentAccountType,
  MpesaPayment as MpesaPaymentType,
  Wallet as WalletDataType,
} from "@/types";

export const addTransaction = async ({
  userId,
  amount,
  method,
  walletId,
}: {
  userId: string;
  amount: number;
  method: string;
  walletId: string;
}): Promise<{
  success: boolean;
  error?: any;
  data?: any;
}> => {
  try {
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
    return {
      success: true,
      data: newTransaction,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error,
    };
  }
};

export const validatePaymentAccount = async ({
  accountId,
  userId,
  method,
}: {
  accountId: string;
  userId: string;
  method: string;
}): Promise<{
  success: boolean;
  error?: any;
  data?: PaymentAccountType;
}> => {
  const account: PaymentAccountType =
    await PaymentAccount.getPaymentAccountById(accountId);
  if (!account) {
    return {
      success: false,
      error: "Payment account not found.",
    };
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

export const updateWallet = async ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<{
  error?: any;
  success: boolean;
  message?: string;
  data?: WalletDataType;
}> => {
  const wallet = await Wallet.withdraw({ userId, amount });
  if (!wallet) {
    return {
      success: false,
      message: "Wallet not found.",
    };
  }
  return {
    success: true,
    data: wallet,
  };
};

export const createMpesaPaymentPayout = async (
  data: MpesaPaymentType
): Promise<{
  success: boolean;
  error?: any;
  data?: MpesaPaymentType;
}> => {
  try {
    const newPayment = await MpesaPayment.createPayment(data);
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
