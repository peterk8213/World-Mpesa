import IntaSend from "intasend-node";
import { calculateWithdrawFee } from "@/lib/wallet/getFees";
import { getConversionRate } from "@/lib/wallet/conversion";

const { PUBLISHABLE_KEY, INTASEND_API_KEY: SECRET_KEY } = process.env;

if (!PUBLISHABLE_KEY || !SECRET_KEY) {
  throw new Error(
    "IntaSend API keys are missing. Check environment variables."
  );
}

const intasend = new IntaSend(PUBLISHABLE_KEY, SECRET_KEY, true); // Set test_mode to true/false as needed
const payouts = intasend.payouts();

async function PayoutIntasend({
  fullname,
  amount,
}: {
  fullname: string;
  amount: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> {
  try {
    const req_approval = "NO"; // Set to 'NO' to avoid manual approval

    const response = await payouts.mpesa({
      currency: "KES",
      requires_approval: req_approval,
      transactions: [
        {
          name: fullname,
          account: "254708374149", // Ensure this is dynamic
          amount,
          narrative: "salary",
        },
      ],
    });

    console.log(`✅ Payouts successful:`, response);

    return {
      success: true,
      message: "Payout successful",
      data: response,
    };
  } catch (error) {
    console.error(`❌ Payouts error:`, error);
    return {
      success: false,
      message: "Payout failed",
      error,
    };
  }
}

export const InitiateIntasendPayout = async ({
  fullname,
  amount,
}: {
  fullname: string;
  amount: number;
}) => {
  try {
    const { conversionRate } = await getConversionRate();
    const fees = calculateWithdrawFee({ amount });

    const { netAmount } = fees;
    const fiatAmount = (netAmount * conversionRate).toFixed(2);
    console.log("fiatAmount", fiatAmount);

    const transaction = await PayoutIntasend({ fullname, amount: fiatAmount });
    return transaction;
  } catch (error) {
    console.error("Error initiating IntaSend payout:", error);
    return {
      success: false,
      message: "Error initiating Payout",
      error,
    };
  }
};

/// check the current status of a transaction

export async function checkPayoutStatus({
  trackingId,
}: {
  trackingId: string;
}) {
  if (!trackingId) {
    console.error("Error: Tracking ID is missing!");
    return;
  }

  try {
    const resp = await payouts.status({ tracking_id: trackingId });

    console.log("Payout Status:", resp);

    // Process response
    if (resp.status === "completed") {
      console.log(`✅ Payout ${trackingId} is successful.`);
      // Update database with completed status
    } else if (resp.status === "pending") {
      console.log(`⏳ Payout ${trackingId} is still pending.`);
      // Optionally retry later
    } else {
      console.error(`❌ Payout ${trackingId} failed.`);
      // Handle failed transaction (e.g., notify user, retry logic)
    }
  } catch (err) {
    console.error("Payout Status Error:", err);
    // Implement retry logic if needed
  }
}
