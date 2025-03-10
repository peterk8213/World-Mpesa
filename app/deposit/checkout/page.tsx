//import {  } from "@worldcoin/idkit";

import { CheckoutForm } from "@/components/CheckoutForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
// import react suspense

import { WorldcoinTransaction } from "@/models/WldTransaction";

import { Suspense } from "react";

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const userAmount = (await searchParams).amount;
  if (!userAmount) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const WldTransactions = await WorldcoinTransaction.find();

  console.log(WldTransactions);

  if (!session) {
    redirect("/");
  }
  console.log(`${process.env.NEXTAUTH_URL}/api/confirm-payment`);
  return (
    <div className="min-h-screen bg-white overflow-hidden ">
      {userAmount ? (
        <Suspense fallback={<div> loading ...</div>}>
          <CheckoutForm userAmount={userAmount} />
        </Suspense>
      ) : (
        <div>Enter a valid amount...</div>
      )}
    </div>
  );
}
