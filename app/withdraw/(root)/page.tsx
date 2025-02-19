import { Suspense } from "react";

import { WithdrawalMethods } from "@/components/WithdrawalMethods";
import { WithdrawalMethod } from "@/types";

import { Provider } from "@/models/provider";

import { cache } from "react";
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
  return JSON.parse(JSON.stringify(withdrawProviders));
};

export default async function WithdrawPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <Suspense fallback={<div>Loading withdrawal methods...</div>}>
          <WithdrawalMethodsWrapper />
        </Suspense>
      </main>
    </div>
  );
}

async function WithdrawalMethodsWrapper() {
  const methods = await getWithdrawalMethods();

  return <WithdrawalMethods methods={methods} />;
}
