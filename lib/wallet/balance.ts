import { Wallet } from "@/models/Wallet";
import { notFound } from "next/navigation";
import { WalletBalanceResponse } from "@/types";

import dbConnect from "@/lib/mongodb";
export const getUserBalance = async ({ userId }: { userId: string }) => {
  try {
    await dbConnect();
    const wallet = await Wallet.getWalletBalanceByUserId(userId);
    if (!wallet) {
      notFound();
    }

    return <WalletBalanceResponse>{ data: wallet, success: true };
  } catch (error) {
    console.error("Error fetching balance:", error);
    return <WalletBalanceResponse>{ error: error, success: true };
  }
};
