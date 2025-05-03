"use server";

import type { RefundInput } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import ManualPayout from "@/models/ManualPayout";
import { Wallet } from "@/models/Wallet";

import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function processRefundAction(
  input: RefundInput
): Promise<{ success: boolean; message?: string }> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  if (session.isAdmin == false || session.isAdmin == undefined) {
    redirect("/");
  }

  await dbConnect();

  const { userId } = session;

  const { payoutId, reason } = input;

  if (!payoutId || !reason) {
    return {
      success: false,
      message: "Payout ID and reason are required.",
    };
  }
  const refundInput: RefundInput = {
    payoutId,

    reason,
  };

  try {
    // Find the payout to refund
    const payoutToRefund = await ManualPayout.findOneAndUpdate(
      { _id: payoutId, status: "pending" },
      { status: "failed", notes: refundInput.reason, processedBy: userId }, // Update the status to failed
      { new: true } // Return the updated document
    ).populate("transactionId"); // Populate the transactionId field if needed

    if (!payoutToRefund) {
      return {
        success: false,
        message: "Payout not found or already refunded.",
      };
    }

    // Update the payout status to refunded
    payoutToRefund.status = "failed";
    await payoutToRefund.save();

    // Update the user's wallet balance
    const userWallet = await Wallet.findOne({ userId });
    if (userWallet) {
      userWallet.balance += payoutToRefund.amountinUsd;
      await userWallet.save();
    }
    revalidatePath("/admin-only-page/payouts"); // Revalidate the payouts page to reflect the changes
    revalidatePath("/admin-olny-page/payout/refund"); // Revalidate the refund page to reflect the changes

    return { success: true };
  } catch (error) {
    console.error("Error processing refund:", error);
    return {
      success: false,
      message: "An error occurred while processing the refund.",
    };
  }
}
