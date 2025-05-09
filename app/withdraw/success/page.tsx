import { WithdrawSuccess } from "@/components/withdrawSuccess";

import ManualPayout from "@/models/ManualPayout";
import { User } from "@/models/User";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { notFound, redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { getConversionRate } from "@/lib/wallet/conversion";
import { Suspense } from "react";
import { Transaction } from "@/models/Transaction";
import { handleNotificationRequest } from "@/actions/HandleNotifications";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const { userId } = session;

  const transactionId = (await searchParams).transactionId; // Default to "weekly"

  if (!transactionId) {
    notFound();
  }

  await dbConnect();

  return (
    <>
      <main className="flex flex-col h-screen">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <WithdrawSuccessWrapper
              userId={userId}
              transactionId={transactionId}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}

const getTransactionData = async ({
  transactionId,
  userId,
}: {
  transactionId: string;
  userId: string;
}) => {
  const [transactiondoc, user] = await Promise.all([
    ManualPayout.findOne({ transactionId, userId })
      .select("phoneNumber amountinKes -_id")
      .populate({
        path: "transactionId",
        select:
          "status amount currency transactionAmount createdAt description method type -_id",
      }),
    User.findById(userId),
  ]);

  if (!user) {
    notFound();
  }

  const { notifications } = user;
  const transaction = transactiondoc?.toObject();
  if (!transaction) {
    notFound();
  }

  const { conversionRate } = await getConversionRate();

  return {
    transaction,
    conversionRate,
    notifications,
  };
};

export const WithdrawSuccessWrapper = async ({
  transactionId,
  userId,
}: {
  transactionId: string;
  userId: string;
}) => {
  const transaction: {
    transaction: {
      transactionId: {
        amount: number;
        type: string;
        status?: string;
        description: string;
        createdAt: string;
        method: string;
      };
      phoneNumber?: string;
      amountinKes: number;
    };
    conversionRate: number;
    notifications: boolean;
  } = await getTransactionData({ transactionId, userId });

  return (
    <WithdrawSuccess
      transaction={transaction}
      handleNotificationRequest={handleNotificationRequest}
    />
  );
};
