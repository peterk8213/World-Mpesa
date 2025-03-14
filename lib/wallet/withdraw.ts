import { Wallet } from "@/models/Wallet";
import { PaymentAccount } from "@/models/PaymentAccount";

import MpesaPayment from "@/models/MpesaPayment";
import { formatWithoutRounding } from "@/lib/formatBalance";

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
  worldId,
  description,
}: {
  userId: string;
  amount: number;
  method: string;
  walletId: string;
  worldId: string;
  description?: string;
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
      walletId,
      reference: uuid,
      worldId,
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
  const account = await PaymentAccount.findOne({
    _id: accountId,
    userId,
  });
  if (!account) {
    return {
      success: false,
      error: "Payment account not found.",
    };
  }
  if (JSON.parse(JSON.stringify(account.providerId)) !== method) {
    return {
      success: false,
      error:
        "Invalid payment method. Please select a valid payment method/account.",
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

export const depositUpdateWallet = async ({
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
  const wallet = await Wallet.deposit({ userId, amount });
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

export const createMpesaPaymentPayout = async ({
  tracking_id,
  request_reference_id,
  transactionAmount,
  status,
  currency,
  estimatedCharges,
  transactionId,
  paymentAccountId,
  userId,
  walletId,
  phoneNumber,
}: MpesaPaymentType): Promise<{
  success: boolean;
  error?: any;
  data?: MpesaPaymentType;
}> => {
  try {
    const newPayment = await MpesaPayment.createPayment({
      tracking_id,
      request_reference_id,
      transactionAmount,
      status: status === "completed" ? "completed" : "pending",
      currency,
      estimatedCharges,
      transactionId,
      paymentAccountId,
      userId,
      walletId,
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
