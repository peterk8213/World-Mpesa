//// page for adding payment accounts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AddPaymentAccountForm } from "@/components/AddPaymentAccount";
import { unstable_cache } from "next/cache";

import { addPaymentAccount } from "@/actions/AddPaymentAccount";
import { Provider } from "@/models/provider";
import dbConnect from "@/lib/mongodb";
import { PayoutProvider } from "@/types";
import { Suspense } from "react";

async function getWithdrawMethods(): Promise<{
  success: Boolean;
  error?: any;
  data?: { value: string; label: string }[];
}> {
  const providers: { _id: string; name: string }[] = (await Provider.find()
    .select("name _id")
    .lean()
    .exec()) as unknown as { _id: string; name: string }[];

  if (!providers || providers.length <= 0) {
    return {
      success: false,
      error: " something went wrong",
    };
  }
  const formattedProviders = providers.map(
    (provider: { _id: string; name: string }) => ({
      value: provider._id.toString(),
      label: provider.name,
    })
  );

  return {
    success: true,
    data: formattedProviders,
  };
}

export default async function AddPaymentAccount() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen  max-w-md mx-auto flex flex-col px-6 pt-0">
      <Suspense>
        <AddPaymentAccountFormWrapper />
      </Suspense>
    </main>
  );
}

async function AddPaymentAccountFormWrapper() {
  const providers = await getWithdrawMethods();

  const { data, success, error } = providers;
  console.log(data);
  if (!success || !data) {
    return;
    console.log(" error fetching methods");
  }

  return (
    <>
      {data?.length > 0 ? (
        <AddPaymentAccountForm
          addPaymentAccount={addPaymentAccount}
          providers={data}
        />
      ) : (
        <div>
          <h1> No payment methods available</h1>
        </div>
      )}
    </>
  );
}
