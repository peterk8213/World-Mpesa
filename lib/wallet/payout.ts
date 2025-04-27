import IntaSend from "intasend-node";
import { calculateWithdrawFee } from "@/lib/wallet/getFees";
import { getConversionRate } from "@/lib/wallet/conversion";
import { formatWithoutRounding } from "@/lib/formatBalance";

async function PayoutIntasend({
  fullname,
  amount,
  phoneNumber,
  description,
  method,
}: {
  fullname?: string;
  amount: string;
  phoneNumber: string;
  description: string;
  method: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> {
  try {
    /////// IntaSend Payouts ///////
    const { PUBLISHABLE_KEY, INTASEND_API_KEY: SECRET_KEY } = process.env;

    if (!PUBLISHABLE_KEY || !SECRET_KEY) {
      throw new Error(
        "IntaSend API keys are missing. Check environment variables."
      );
    }

    const intasend = new IntaSend(PUBLISHABLE_KEY, SECRET_KEY, false); // Set test_mode to true/false as needed
    const payouts = intasend.payouts();

    const req_approval = "NO"; // Set to 'NO' to avoid manual approval

    const formattedPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber.slice(1)
      : phoneNumber;

    /////// Initiate Payout with IntaSend //////

    console.log(
      `🚀 Initiating IntaSend payout to ${formattedPhoneNumber} for ${amount} KES...`
    );

    const response = await payouts.mpesa({
      currency: "KES",
      requires_approval: req_approval,
      transactions: [
        {
          name: fullname,
          account: formattedPhoneNumber, // Ensure this is dynamic
          amount,
          narrative: description,
        },
      ],
    });

    console.log(`✅ Payouts successful:`, response);

    //////////////// Process response

    return {
      success: true,
      message: "Payout successful",
      data: response,
    };
  } catch (error) {
    ////// Handle errors //////
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
  phoneNumber,
  description,
  method,
}: {
  fullname?: string;
  amount: number;
  phoneNumber: string;
  description: string;
  method: string;
}) => {
  try {
    //////////////////////// Initiate Payout with IntaSend ////////////////////////

    const { conversionRate } = await getConversionRate();
    const fees = calculateWithdrawFee({ amount });

    const { netAmount } = fees;
    const fiatAmount = formatWithoutRounding(netAmount * conversionRate, 1);

    // what is it has no decimal point

    const truncated = fiatAmount.toString().split(".")[0];

    console.log("fiatAmount", fiatAmount, truncated, conversionRate, netAmount);

    ////// Initiate Payout with IntaSend //////

    const transaction = await PayoutIntasend({
      fullname,
      amount: truncated,
      phoneNumber,
      description,
      method,
    });

    ////// Handle response from IntaSend //////
    return transaction;

    ///////////////
  } catch (error) {
    ////// Handle errors //////

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
    /////// IntaSend Payouts ///////
    const { PUBLISHABLE_KEY, INTASEND_API_KEY: SECRET_KEY } = process.env;

    if (!PUBLISHABLE_KEY || !SECRET_KEY) {
      throw new Error(
        "IntaSend API keys are missing. Check environment variables."
      );
    }

    const intasend = new IntaSend(PUBLISHABLE_KEY, SECRET_KEY, true); // Set test_mode to true/false as needed
    const payouts = intasend.payouts();

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
