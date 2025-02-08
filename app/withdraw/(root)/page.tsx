import { Suspense } from "react";

import { WithdrawalMethods } from "@/components/WithdrawalMethods";
import { WithdrawalMethod } from "@/types";

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
  

  return [
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      iconUrl: "/placeholder.svg?height=24&width=24",
      available: true,
      minAmount: 50,
      maxAmount: 10000,
      processingTime: "1-3 business days",
      fees: "1% + $0.30",
      description: "Transfer directly to your bank account",
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      iconUrl: "https://www.safaricom.co.ke/images/main.png",
      available: true,
      minAmount: 1,
      maxAmount: 1500,
      processingTime: "Instant",
      fees: "2%",
      description: "Withdraw to your M-Pesa wallet instantly",
    },
    {
      id: "airtel-money",
      name: "Airtel Money",
      iconUrl: "/placeholder.svg?height=24&width=24",
      available: false,
      minAmount: 10,
      maxAmount: 1000,
      processingTime: "Instant",
      fees: "1.5%",
      description: "Fast mobile money transfers (Coming soon)",
    },
    {
      id: "airtime",
      name: "Airtime",
      iconUrl: "/placeholder.svg?height=24&width=24",
      available: true,
      minAmount: 5,
      maxAmount: 100,
      processingTime: "Instant",
      fees: "No fees",
      description: "Convert your balance to mobile airtime",
    },
  ];
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
  console.log(methods);

  return <WithdrawalMethods methods={methods} />;
}
