"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Amount } from "@/types";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
// import { useSession } from "next-auth/react";
import { toastError, toastInfo, toastSuccess, toastWarning } from "@/lib/toast";

type PaymentResponse = {
  success: boolean;
  data?: {
    id: string;
    wallet: string;
    cryptoAmount: Amount;
    transactionId: string;
  };
  error: any;
};

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

    const { success, data, error }: PaymentResponse = await res.json();

    if (success === false) {
      toastError(error);

      return;
    }
    if (!data) {
      toastError("Payment data is undefined");
      return;
    }
    const { id, wallet, cryptoAmount, transactionId } = data;

    console.log(data);

    const payload: PayCommandInput = {
      reference: id,
      to: wallet,
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
      description: "Deposit funds quickly and securely with WorldPay.",
    };
    if (MiniKit.isInstalled()) {
      const sendPaymentResponse = await MiniKit.commandsAsync.pay(payload);
      return { sendPaymentResponse, transactionId };
    }
    return null;
  } catch (error: unknown) {
    toastWarning("Failed to send payment");
    console.log("Error sending payment", error);
    return null;
  }
};

////// 8/17/25  return a bool on txn status

const handlePay = async ({
  userAmount,
}: {
  userAmount: string;
}): Promise<boolean> => {
  try {
    if (!MiniKit.isInstalled()) {
      toastError(
        "MiniKit is not installed. Make sure you're running the application inside of World App"
      );
      console.error("MiniKit is not installed");
      return false;
    }
    /////////// only for testing purposes to reduce token usage
    //const paymentResult = await sendPayment({ userAmount: "0.1" });
    const paymentResult = await sendPayment({ userAmount });
    if (!paymentResult) {
      return false;
    }
    const { sendPaymentResponse, transactionId } = paymentResult;
    const response = sendPaymentResponse.finalPayload;

    if (!response) {
      return false;
    }

    console.log("Payment response", sendPaymentResponse, transactionId);

    if (response.status == "success") {
      const res = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: response,
          transactionId,
        }),
      });
      const payment = await res.json();
      if (payment.success) {
        // Congrats your payment was successful!
        toastSuccess("Payment successful");
        console.log("SUCCESS!");

        return true;
      } else {
        // Payment failed
        toastError("Payment failed");
        console.log("FAILED!");
        return false;
      }
    }
    if (response.status == "error") {
      toastError("Payment failed");
      console.log("Payment failed");
      return false;
    }
  } catch (error) {
    console.error("Error sending payment", error);
    toastError("Error sending payment");
    return false;
  }
};

export const PayBlock = ({ userAmount }: { userAmount: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onPayClick = useCallback(async () => {
    try {
      setIsLoading(true);

      const status = await handlePay({ userAmount });
      if (status) {
        router.push("/home");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userAmount]);
  return (
    <div className="fixed bottom-5 left-0 right-0 p-4 z-10">
      <Button
        onClick={onPayClick}
        className="w-full bg-black text-white py-6 rounded-lg font-medium text-lg hover:scale-95 transition-transform"
        fullWidth
        isLoading={isLoading}
      >
        Deposit Now
      </Button>
    </div>
  );
};
