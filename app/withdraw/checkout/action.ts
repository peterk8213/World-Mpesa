"use server";

import { revalidatePath } from "next/cache";

export async function processWithdrawal(method: string, amount: string) {
  try {
    // Validate input
    const withdrawalAmount = Number.parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      throw new Error("Invalid withdrawal amount");
    }

    // In a real app, you would call your API here
    const response = await fetch("https://api.example.com/process-withdrawal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, amount: withdrawalAmount }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Withdrawal processing failed");
    }

    const result = await response.json();

    // Revalidate the balance on the withdraw page
    revalidatePath("/withdraw");

    return { success: true, transactionId: result.transactionId };
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
