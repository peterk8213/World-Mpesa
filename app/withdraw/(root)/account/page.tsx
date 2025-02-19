import { PaymentAccount as PaymentAccountType } from "@/types";
import WithdrawAccountCard from "@/components/PaymentAccountCard";
import NoPaymentMethodsPage from "@/components/NoPaymentAccount";
import AccountSelectionClient from "@/components/AccountSelectionClient";
import { Suspense } from "react";
import { PaymentAccount } from "@/models/PaymentAccount";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Simulate fetching accounts from a database
async function getAccounts(userId: string): Promise<PaymentAccountType[]> {
  const accounts = await PaymentAccount.getPaymentAccountsByUserId(userId);

  console.log("Accounts", accounts);

  return JSON.parse(JSON.stringify(accounts));
}

export default async function AccountSelectionPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>;
}) {
  const method = (await searchParams).method || "";
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const { userId } = session;

  return (
    <div>
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
  const accounts = await getAccounts(userId);

  return (
    <>
      {accounts.length > 0 ? (
        <AccountSelectionClient method={method} accounts={accounts} />
      ) : (
        <NoPaymentMethodsPage />
      )}
    </>
  );
}
