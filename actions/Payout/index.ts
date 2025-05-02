"use server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { revalidatePath, revalidateTag } from "next/cache";
import ManualPayout from "@/models/ManualPayout";
import { Transaction } from "@/models/Transaction";
import { completeManualPayout } from "@/lib/wallet/manualpayout";

interface State {
  success?: boolean;
  message?: string;
  error?: string;
  pending?: boolean;
}

import type { CompletePayoutInput } from "@/types";

export const completeManualPayoutAction = async (
  input: CompletePayoutInput,
  prevState: State
): Promise<State> => {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) {
    redirect("/");
  }
  const { userId } = session;
  await dbConnect();

  console.log("Received payout completion request:", input);

  const result = await completeManualPayout({
    payoutId: input.payoutId,
    adminId: userId,
    status: input.status,
    confirmationCode: input.confirmationCode,
    notes: input.notes,
    actualCharges: input.actualCharges,
  });

  if (!result.success) {
    console.error("Mock Payout update failed:", result.error);
    return {
      success: false,
      message: result.message || "Failed to update payout.",
    };
  }
  console.log("Payout update successful:", input);

  return {
    success: true,
    message: "Payout updated successfully.",
  };
};
