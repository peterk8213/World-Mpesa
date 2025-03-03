import { PaymentAccount as PaymentAccountType } from "@/types";

import { NoAccounts } from "@/components/NoPaymentAccount";
import AccountSelectionClient from "@/components/AccountSelectionClient";
import { Suspense } from "react";
import { PaymentAccount } from "@/models/PaymentAccount";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";

// Simulate fetching accounts from a database
async function getAccounts({
  userId,
  method,
}: {
  userId: string;
  method: string;
}): Promise<PaymentAccountType[]> {
  const accounts = await PaymentAccount.find({ userId, providerId: method })
    .sort({ isdefault: -1 })
    .populate({
      path: "providerId",
      select: "shortname",
    });

  console.log("Accounts", accounts);

  return JSON.parse(JSON.stringify(accounts));
}

export default async function AccountSelectionPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>;
}) {
  const method = (await searchParams).method;
  if (!method) {
    notFound();
  }
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const { userId } = session;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <Suspense fallback={<div> loading accounts.......</div>}>
        <AccountSelectionClientWrapper method={method} userId={userId} />
      </Suspense>
    </div>
  );
}

async function AccountSelectionClientWrapper({
  method,
  userId,
}: {
  method: string;
  userId: string;
}) {
  const accounts = await getAccounts({
    userId,
    method,
  });

  return (
    <>
      {accounts.length > 0 ? (
        <div className="flex items-center justify-center h-screen">
          <AccountSelectionClient accounts={accounts} method={method} />
        </div>
      ) : (
        <NoAccounts />
      )}
    </>
  );
}
