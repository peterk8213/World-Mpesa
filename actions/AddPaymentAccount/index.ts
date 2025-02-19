"use server";

import dbConnect from "@/lib/mongodb";
import { Wallet } from "@/models/Wallet";
import { PaymentAccount } from "@/models/PaymentAccount";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function addPaymentAccount(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  try {
    const { userId } = session;
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const provider = formData.get("provider") as string;
    const isDefault = (formData.get("isDefault") === "on") as boolean;

    console.log(prevState);
    if (!fullName || !phoneNumber || !provider) {
      return {
        ...prevState,
        error: "Please fill in all fields",
      };
    }

    await dbConnect();

    const userWallet = await Wallet.getWalletByUserId(userId);

    if (!userWallet) {
      return {
        ...prevState,
        error: "No wallet found for the user",
      };
    }

    console.log("Adding payment account", {
      userId,
      fullName,
      phoneNumber,
      provider,
      isDefault,
    });

    const paymentAccount = await PaymentAccount.addPaymentAccount({
      userId,
      fullName,
      phoneNumber,
      walletId: userWallet._id,
      providerId: provider,
      isdefault: isDefault,
    });

    if (!paymentAccount) {
      return {
        ...prevState,
        error: "An error occurred while adding the payment account",
      };
    }

    return {
      ...prevState,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ...prevState,
      error: "An error occurred while adding the payment account",
      pending: false,
    };
  }
}
