import { NextResponse } from "next/server";
import MpesaPayment, { IPayment } from "@/models/MpesaPayment";
import { Transaction } from "@/models/Transaction";
import dbConnect from "@/lib/mongodb";
import { updateWallet } from "@/lib/wallet/withdraw";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const INTASEND_CHALLENGE_KEY = process.env.INTASEND_CHALLENGE_KEY;
    console.log("📩 Received Webhook Event:", payload.tracking_id);

    // ✅ Validate the webhook challenge key

    const { tracking_id, status } = payload;
    const txn = payload.transactions[0];
    const actualCharges = parseFloat(payload.actual_charges ?? txn.charge);
    const { challenge } = payload;

    // ✅ Validate challenge token (IntaSend sends this during verification)
    if (challenge !== INTASEND_CHALLENGE_KEY) {
      console.error("❌ Invalid challenge key:", challenge);
      return NextResponse.json({ success: false }, { status: 403 });
    }

    // if the status is pending ignore the request because the default status is pending
    if (status === "Sending payment") {
      console.log("❌ Ignoring pending status:", status);
      return NextResponse.json({ success: false }, { status: 200 });
    }
    // Connect to the database

    await dbConnect();

    // Map IntaSend status to your system's status values
    let mappedStatus = "pending"; // Default value for unknown status
    switch (status) {
      case "Completed":
        mappedStatus = "completed";
        break;
      case "Failed Processing":
        mappedStatus = "failed";
        break;
      case "Sending payment":
        mappedStatus = "pending"; // You could choose a different status, depending on your logic
        break;
      default:
        mappedStatus = "pending"; // Default case
        break;
    }

    // Call  static method to update the existing payment

    const updateResult: {
      success: boolean;
      error?: any;
      data?: IPayment | null;
    } = await MpesaPayment.updatePaymentStatus(
      tracking_id,
      mappedStatus,
      actualCharges
    );

    if (!updateResult.success) {
      console.error("❌ Error updating payment status:", updateResult.error);
      return;
    }
    const { userId, reference } = updateResult.data as IPayment;

    const updatedTxn = await Transaction.findOneAndUpdate(
      { userId, reference },
      {
        status: "completed",
      },
      { new: true, runValidators: true }
    );
    if (!updatedTxn) {
      console.error(
        "❌ Error updating transaction status:",
        updateResult.error
      );
      return;
    }

    console.log(
      `✅ Payment ${tracking_id} updated to status=${mappedStatus}, actualCharges=${actualCharges}`
    );

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
