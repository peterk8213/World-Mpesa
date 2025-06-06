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

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-full bg-white overflow-auto lg:mx-20 gap-[3rem] ">
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
