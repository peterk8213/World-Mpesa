import { DepositKeypad } from "@/components/DepositKeypad";
import { Suspense } from "react";

import { getConversionRate } from "@/actions/GetFiatEquivalent";

export default async function Home() {
  const { conversionRate } = await getConversionRate();

  return (
    <div className="max-h-screen bg-white">
      <Suspense fallback={<div>Loading deposit keypad...</div>}>
        <DepositKeypad conversionRate={conversionRate} />
      </Suspense>
    </div>
  );
}
