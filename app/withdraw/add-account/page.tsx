//// page for adding payment accounts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AddPaymentAccountForm } from "@/components/AddPaymentAccount";

import { addPaymentAccount } from "@/actions/AddPaymentAccount";

export default async function AddPaymentAccount() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen  max-w-md mx-auto flex flex-col px-6 pt-0">
      <AddPaymentAccountForm addPaymentAccount={addPaymentAccount} />
    </main>
  );
}
