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

export async function ProcessSendMoney(
  prevState: State,
  formData: FormData
): Promise<State> {
  console.log("ProcessSendMoney", formData, prevState);
  return {
    ...prevState,
    success: true,
  };
}
