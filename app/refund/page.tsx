/// ssr page for users to request refunds

import { RefundRequestPage } from "@/components/RequestRefundPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import dbConnect from "@/lib/mongodb";

import { submitRefundRequest } from "@/actions/SubmitRefund";
import { Wallet } from "@/models/Wallet";
import { Suspense } from "react";
import { formatWithoutRounding } from "@/lib/formatBalance";

const getUserWallet = async ({ userId }: { userId: string }) => {
  const user = await Wallet.getWalletByUserId(userId);

  const {
    balance,
  }: {
    balance: number;
  } = user;

  if (!user) {
    redirect("/no-user-data");
  }
  if (!balance) {
    redirect("/no-user-data");
  }

  return balance;
};

export default async function RefundPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const { userId } = session;
  await dbConnect();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <RefundPageWrapper userId={userId} />
    </div>
  );
}

/// Refund page wrapper

const RefundPageWrapper = async ({ userId }: { userId: string }) => {
  const balance = await getUserWallet({ userId });

  return (
    <RefundRequestPage
      submitRefundRequest={submitRefundRequest}
      Balance={parseFloat(formatWithoutRounding(balance - 0.01, 2))} // Replace with actual balance if needed
    />
  );
};
