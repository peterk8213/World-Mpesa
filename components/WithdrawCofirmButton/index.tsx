import { useActionState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toastLoading, toastSuccess } from "@/lib/toast";

const MotionButton = motion.create(Button);

export function WithdrawConfirmButton({
  accountId,
  amount,
  method,
  userId,
  processWithdrawal,
}: {
  accountId: string;
  amount: string;
  method: string;
  userId: string;
  processWithdrawal: any;
}) {
  const router = useRouter();
  /////// use Action state for the loading and error and success state
  const [state, formAction, isPending] = useActionState(processWithdrawal, {
    success: false,
    error: "",
    pending: true,
    transactionId: "",
  });

  useEffect(() => {
    if (isPending) {
      toastLoading("Processing...🧲🧭");
    }
    // if (state.success) {
    //   router.push("/withdraw/success");
    // }

    // if (state.error) {
    //   console.log(s]tate.error);
    //   router.push("/withdraw/error");
    // }]
    if (state.success === true) {
      toastSuccess("Withdrawal Successful  redirecting 🚥🚧");
    }
    return;
  }, [isPending]);
  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="accountId" value={accountId} />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="method" value={method} />
        <input type="hidden" name="userId" value={userId} />

        <MotionButton
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          disabled={isPending}
          type="submit"
          className="w-full bg-black text-white py-6 rounded-lg font-medium text-lg hover:scale-95 transition-transform"
        >
          CONFIRM
        </MotionButton>
      </form>
    </>
  );
}
