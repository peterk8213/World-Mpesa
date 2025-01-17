import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/DepositHeader";

import { CheckoutForm } from "@/components/CheckoutForm";

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const amount = (await searchParams).amount;
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header
        leftIcon={<ArrowLeft className="h-6 w-6" />}
        showLogo={false}
        title="Checkout"
      />
      <CheckoutForm amount={amount} />
    </div>
  );
}
