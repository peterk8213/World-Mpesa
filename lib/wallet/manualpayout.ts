import ManualPayout from "@/models/ManualPayout";
import { calculateWithdrawFee } from "@/lib/wallet/getFees";
import { getConversionRate } from "@/lib/wallet/conversion";
import { formatWithoutRounding } from "@/lib/formatBalance";
import { Types } from "mongoose";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { sendWithdrawalEmail } from "@/lib/mail";

export const initiateManualPayout = async ({
  userId,
  transactionId,
  fullname,
  amount,
  phoneNumber,
  description,
}: {
  userId: string;
  transactionId: string;
  fullname?: string;
  amount: number;
  phoneNumber: string;
  description: string;
}) => {
  try {
    const { conversionRate } = await getConversionRate();
    const fees = calculateWithdrawFee({ amount });
    const { netAmount, totalFee } = fees;

    const kesAmount = parseFloat(
      formatWithoutRounding(netAmount * conversionRate, 1)
        .toString()
        .split(".")[0]
    );

    const newPayout = await ManualPayout.create({
      transactionId: new Types.ObjectId(transactionId),
      phoneNumber,
      amountinKes: kesAmount,
      amountinUsd: amount,
      currency: "KES",
      status: "pending",
      userId: new Types.ObjectId(userId),
      notes: description,
      ReceiverPartyPublicName: fullname,
      actualCharges: amount - netAmount,
      fees: totalFee,
    });

    // Send the email alert

    await sendWithdrawalEmail(newPayout);

    return {
      success: true,
      message: "Payout request submitted and pending admin review.",
      data: newPayout,
    };
  } catch (error) {
    console.error("Manual payout error:", error);
    return {
      success: false,
      message: "Failed to create payout request",
      error,
    };
  }
};

export const completeManualPayout = async ({
  payoutId,
  adminId,
  status,
  confirmationCode,
  notes,
  actualCharges,
}: {
  payoutId: string;
  adminId: string;
  status: "completed" | "failed";
  confirmationCode?: string;
  notes?: string;
  actualCharges?: number;
}) => {
  try {
    const isAdmin = await User.findById(adminId);
    if (!isAdmin || !isAdmin.isAdmin) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const updateData: Record<string, any> = {
      status,
      processedBy: new Types.ObjectId(adminId),
      updatedAt: new Date(),
    };

    if (confirmationCode) {
      updateData.confirmationCode = confirmationCode;
    }

    if (notes) {
      updateData.notes = notes;
    }

    if (actualCharges !== undefined) {
      updateData.actualCharges = actualCharges;
    }

    const updated = await ManualPayout.findByIdAndUpdate(
      new Types.ObjectId(payoutId),
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "Manual payout not found",
      };
    }
    const transactionId = updated.transactionId.toString();
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );
    if (!transaction) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    return {
      success: true,
      message: `Payout successfully marked as ${status}`,
      data: updated,
    };
  } catch (error) {
    console.error("Manual payout update error:", error);
    return {
      success: false,
      message: "Failed to update payout",
      error,
    };
  }
};
