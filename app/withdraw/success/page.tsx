import { WithdrawSuccess } from "@/components/withdrawSuccess";

import { Transaction } from "@/models/Transaction";

import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { notFound, redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { getConversionRate } from "@/lib/wallet/conversion";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  const session = await getServerSession(authOptions);

  const { userId } = session;

  if (!session) {
    redirect("/");
  }

  const transactionId = (await searchParams).transactionId; // Default to "weekly"

  if (!transactionId) {
    notFound();
  }

  await dbConnect();
  const transaction = await getTransactionData({ transactionId, userId });
  console.log(transaction);

  return (
    <>
      <main className="flex flex-col items-center justify-center h-screen">
        <WithdrawSuccess transaction={transaction} />
        <div></div>
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
  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  }).select("status amount currency createdAt description method type -_id");

  const { conversionRate } = await getConversionRate();

  return {
    ...transaction.toObject(),
    conversionRate,
  };
};
