import { Phone, HandCoins } from "lucide-react";
import { processWithdrawal } from "@/actions/ProcessWithdraw";
import { WithdrawRequestCheckout } from "@/types";
import { InfoItem } from "@/components/InfoItem";
import Form from "next/form";

import { WithdrawCheckoutpage } from "@/components/WithdrawCheckoutData";
import { Button } from "@/components/ui/button";

export function WithdrawalConfirmation({
  withdrawCheckoutData,
  userId,
}: {
  withdrawCheckoutData: WithdrawRequestCheckout;
  userId: string;
}) {
  const {
    processdata: { amount, accountId, method },
  } = withdrawCheckoutData;

  return (
    <div className="flex flex-col  w-full ">
      <WithdrawCheckoutpage withdrawCheckoutData={withdrawCheckoutData} />

      <div className="fixed bottom-0 left-0 right-0 p-4 z-10">
        <div className="max-w-md mx-auto space-y-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
            <form action={processWithdrawal}>
              <input type="hidden" name="accountId" value={accountId} />
              <input type="hidden" name="amount" value={amount} />
              <input type="hidden" name="method" value={method} />
              <input type="hidden" name="userId" value={userId} />

              <Button
                type="submit"
                className="w-full bg-black text-white py-6 rounded-lg font-medium text-lg hover:scale-95 transition-transform"
              >
                CONFIRM
              </Button>
            </form>
          </div>
          {/* <button className="w-full flex items-center justify-center text-gray-600 hover:text-black transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            Contact Support
          </button> */}
        </div>
      </div>
    </div>
  );
}
