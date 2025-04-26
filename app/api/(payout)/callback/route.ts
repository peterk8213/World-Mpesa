import { NextResponse } from "next/server";
import MpesaPayment from "@/models/MpesaPayment";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const INTASEND_CHALLENGE_KEY = process.env.INTASEND_CHALLENGE_KEY;
    console.log("📩 Received Webhook Event:", payload);

    // ✅ Validate challenge token (IntaSend sends this during verification)
    if (payload.challenge) {
      return NextResponse.json({ challenge: payload.challenge });
    }

    // ✅ Validate the webhook challenge key

    ////// ✅ Extract event details
    const { tracking_id, status, transactions } = payload;

    switch (status) {
      case "Completed":
        console.log(`✅ Payment for ${tracking_id} completed successfully.`);
        break;
      case "Failed Processing":
        console.log(`❌ Payment for ${tracking_id} failed.`);
        break;
      case "Sending payment":
        console.log(`⏳ Payment for ${tracking_id} is being sent.`);
        break;
      default:
        console.log(`ℹ️ Payment for ${tracking_id} is in status: ${status}`);
        break;
    }

    // ✅ Optionally, store transaction details in a database here

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
