import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/DepositHeader";
//import {  } from "@worldcoin/idkit";

import { CheckoutForm } from "@/components/CheckoutForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
// import react suspense

import { Suspense } from "react";

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const userAmount = (await searchParams).amount || "0";
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header
        leftIcon={<ArrowLeft className="h-6 w-6" />}
        showLogo={false}
        title="Checkout"
      />
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
