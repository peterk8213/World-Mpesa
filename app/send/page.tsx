import { SendMoneyPage } from "@/components/SendMoneyPage";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getConversionRate } from "@/lib/wallet/conversion";
import { ConversionRate as ConversionRateType } from "@/types";
import { getUserBalance } from "@/lib/wallet/balance";

export default async function SendPage() {
  const session = await getServerSession(authOptions);
  const { userId } = session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-2 md:p-6">
      <SendMoneyPageWrapper userId={userId} />
    </div>
  );
}

async function SendMoneyPageWrapper({ userId }: { userId: string }) {
  const { data } = await getUserBalance({ userId });
  const conversionRate: ConversionRateType = await getConversionRate();

  return (
    <>
      <SendMoneyPage walletBalance={data?.balance || 0} userId={userId} />
    </>
  );
}
