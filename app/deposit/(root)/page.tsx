import { DepositKeypad } from "@/components/DepositKeypad";
import { Suspense } from "react";

import { getConversionRate } from "@/lib/wallet/conversion";

export default async function Home() {
  return (
    <div className="max-h-screen bg-white">
      <Suspense fallback={<div>Loading deposit keypad...</div>}>
        <DepositKeypadWrapper />
      </Suspense>
    </div>
  );
}

const DepositKeypadWrapper = async () => {
  const { conversionRate } = await getConversionRate();

  return <DepositKeypad conversionRate={conversionRate} />;
};
