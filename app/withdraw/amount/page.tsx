import { Suspense } from "react";

import { WithdrawKeypad } from "@/components/WithdrawKeypad";

export default async function WithdrawAmountPage({
  searchParams,
}: {
  searchParams: Promise<{ method: string }>;
}) {
  // dummy implementation get user balance

  //   export const getUserBalance = cache(async () => {
  //     try {
  //       const response = await fetch("https://api.example.com/user-balance", {
  //         next: { revalidate: 60 }, // Revalidate every minute
  //       });
  //       if (!response.ok) throw new Error("Failed to fetch user balance");
  //       const data = await response.json();
  //       return data.balance;
  //     } catch (error) {
  //       console.error("Error fetching user balance:", error);
  //       throw new Error("Unable to load your balance. Please try again later.");
  //     }
  //   });
  const getUserBalance = async () => {
    return 100;
  };
  const method = (await searchParams).method;

  const balance = await getUserBalance();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <h1 className="text-2xl font-bold text-center">Enter Amount</h1>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <WithdrawKeypad method={method} balance={balance} />
        </Suspense>
      </main>
    </div>
  );
}
