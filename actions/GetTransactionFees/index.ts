" use server";

// a function for caclculating the transaction fees for a given amount
// for now it will only handle withdraw for there are no fees for desitising
import { InitiateWithdrawData } from "@/types";

export async function getTransactionFees({
  amount,
  method,
  accountId,
}: InitiateWithdrawData) {
  try {
    if (!amount) {
      throw new Error("Invalid amount");
    }
    // for now we are only handling withdraw fees
    const fees = parseFloat(amount) * 0.015 + 0.3;
    return fees;
  } catch (error) {
    console.error("Error in getTransactionFees:", error);
    throw new Error("Unable to calculate transaction fees.");
  }
}
