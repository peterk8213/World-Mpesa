import { Suspense } from "react";

import { WithdrawalMethods } from "@/components/WithdrawalMethods";
import { WithdrawalMethod } from "@/types";

import { Provider } from "@/models/provider";

import { unstable_cache } from "next/cache";
import { Phone, Banknote } from "lucide-react";

// export const getWithdrawalMethods = cache(async () => {
//   try {
//     const response = await fetch("https://api.example.com/withdrawal-methods", {
//       next: { revalidate: 3600 }, // Revalidate every hour
//     });
//     if (!response.ok) throw new Error("Failed to fetch withdrawal methods");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching withdrawal methods:", error);
//     throw new Error(
//       "Unable to load withdrawal methods. Please try again later."
//     );
//   }
// });

// Dummy implementation

const getWithdrawalMethods = async (): Promise<WithdrawalMethod[]> => {
  const withdrawProviders = await Provider.find().sort({ available: -1 });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Withdrawal methods no caching");
  return JSON.parse(JSON.stringify(withdrawProviders));
};

export default async function WithdrawPage() {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className=" p-4">
        <Suspense fallback={<div>Loading withdrawal methods...</div>}>
          <WithdrawalMethodsWrapper />
        </Suspense>
      </main>
    </div>
  );
}

async function WithdrawalMethodsWrapper() {
  const getCachedPayoutMethods = unstable_cache(
    getWithdrawalMethods,
    ["withdrawal-methods"],
    { revalidate: 60 }
  );
  const methods = await getCachedPayoutMethods();

  return <WithdrawalMethods methods={methods} />;
}
