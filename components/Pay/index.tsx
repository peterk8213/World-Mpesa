"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";

import { Amount } from "@/types";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
// import { useSession } from "next-auth/react";
import { toastError, toastInfo, toastSuccess, toastWarning } from "@/lib/toast";

const sendPayment = async ({ userAmount }: { userAmount: string }) => {
  try {
    toastInfo("⚡⚡Sending payment...");
    const res = await fetch(`/api/initiate-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositAmount: userAmount }),
      // body: JSON.stringify({ depositAmount }),
      // body: JSON.stringify({ payload: session }),
    });

    const { id, wallet, cryptoAmount } = await res.json();

    console.log(id, wallet, cryptoAmount);

    const payload: PayCommandInput = {
      reference: id,
      to: wallet, // Test address
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(
            cryptoAmount.WLD,
            Tokens.WLD
          ).toString(),
        },
        {
          symbol: Tokens.USDCE,
          token_amount: tokenToDecimals(
            cryptoAmount.USDCE,
            Tokens.USDCE
          ).toString(),
        },
      ],
      description: "Watch this is a test",
    };
    if (MiniKit.isInstalled()) {
      return await MiniKit.commandsAsync.pay(payload);
    }
    return null;
  } catch (error: unknown) {
    toastWarning("Failed to send payment");
    console.log("Error sending payment", error);
    return null;
  }
};

const handlePay = async ({ userAmount }: { userAmount: string }) => {
  try {
    if (!MiniKit.isInstalled()) {
      toastError(
        "MiniKit is not installed. Make sure you're running the application inside of World App"
      );
      console.error("MiniKit is not installed");
      return;
    }

    const sendPaymentResponse = await sendPayment({ userAmount });
    const response = sendPaymentResponse?.finalPayload;
    if (!response) {
      return;
    }
    console.log("Payment response", sendPaymentResponse);

    if (response.status == "success") {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/confirm-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: response }),
        }
      );
      const payment = await res.json();
      if (payment.success) {
        // Congrats your payment was successful!
        console.log("SUCCESS!");
      } else {
        // Payment failed
        console.log("FAILED!");
      }
    }
  } catch (error) {
    console.error("Error sending payment", error);
  }
};

export const PayBlock = ({ userAmount }: { userAmount: string }) => {
  return (
    <div className="fixed bottom-5 left-0 right-0 p-4 z-10">
      <Button
        onClick={() => handlePay({ userAmount })}
        className="w-full bg-black text-white py-6 rounded-lg font-medium text-lg hover:scale-95 transition-transform"
      >
        Deposit Now
      </Button>
    </div>
  );
};
