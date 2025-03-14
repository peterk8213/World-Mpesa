import { WithdrawSuccess } from "@/components/withdrawSuccess";

import MpesaPayment from "@/models/MpesaPayment";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { notFound, redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { getConversionRate } from "@/lib/wallet/conversion";
import { Suspense } from "react";

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
  const transaction = await MpesaPayment.findOne({
    transactionId,
    userId,
  })
    .select("phoneNumber transactionAmount -_id")
    .populate({
      path: "transactionId",
      select:
        "status amount currency transactionAmount  createdAt description method type -_id",
    });

  const { conversionRate } = await getConversionRate();

  return {
    ...transaction.toJSON(),
    conversionRate,
  };
};

const WithdrawSuccessWrapper = async ({
  transactionId,
  userId,
}: {
  transactionId: string;
  userId: string;
}) => {
  const transaction = await getTransactionData({ transactionId, userId });
  console.log(transaction);
  return <WithdrawSuccess transaction={transaction} />;
};
