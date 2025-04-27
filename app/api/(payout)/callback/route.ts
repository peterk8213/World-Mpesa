import { NextResponse } from "next/server";
import MpesaPayment from "@/models/MpesaPayment";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const INTASEND_CHALLENGE_KEY = process.env.INTASEND_CHALLENGE_KEY;
    console.log("📩 Received Webhook Event:", payload.tracking_id);

    // ✅ Validate the webhook challenge key

    ////// ✅ Extract event details
    const { tracking_id, status } = payload;
    const txn = payload.transactions[0];
    const actualCharges = parseFloat(payload.actual_charges ?? txn.charge);
    const { challenge } = payload;

    // ✅ Validate challenge token (IntaSend sends this during verification)
    if (challenge !== INTASEND_CHALLENGE_KEY) {
      console.error("❌ Invalid challenge key:", challenge);
      return NextResponse.json({ success: false }, { status: 403 });
    }

    await dbConnect(); // Connect to the database

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

    const updateResult = await MpesaPayment.updatePaymentStatus(
      tracking_id,
      mappedStatus,
      actualCharges
    );

    if (updateResult.matchedCount === 0) {
      console.warn(`⚠️ No payment found for tracking_id=${tracking_id}`);
      return NextResponse.json(
        {
          success: false,
          message: `No payment record for ${tracking_id}`,
        },
        { status: 404 }
      );
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
