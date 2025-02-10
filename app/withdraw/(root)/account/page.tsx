import { PaymentAccount as PaymentAccountType } from "@/types";
import WithdrawAccountCard from "@/components/PaymentAccountCard";
import NoPaymentMethodsPage from "@/components/NoPaymentAccount";
import AccountSelectionClient from "@/components/AccountSelectionClient";
import { Suspense } from "react";
import { motion } from "framer-motion";

// Simulate fetching accounts from a database
async function getAccounts(): Promise<PaymentAccountType[]> {
  console.log("Fetching accounts... running on the server");

  return [
    {
      id: "123456",
      provider: "mpesa",
      phoneNumber: "+254 712 345 678",
      holderName: "John Doe",
      addedOn: "2023-05-15T10:30:00Z",
    },
    {
      id: "1234565",
      provider: "paypal",
      phoneNumber: "+254 712 345 678",
      holderName: "John Doe",
      addedOn: "2023-05-15T10:30:00Z",
    },
    {
      id: "789012",
      provider: "bank",
      phoneNumber: "+254 723 456 789",
      holderName: "Jane Smith",
      addedOn: "2023-06-20T14:45:00Z",
    },
    {
      id: "345678",
      provider: "airtel",
      phoneNumber: "+254 734 567 890",
      holderName: "Alice Johnson",
      addedOn: "2023-07-05T09:15:00Z",
    },
  ];
}

export default async function AccountSelectionPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>;
}) {
  const method = (await searchParams).method || "";

  return (
    <div>
      <Suspense fallback={<div> loading accounts.......</div>}>
        <AccountSelectionClientWrapper method={method} />
      </Suspense>
    </div>
  );
}

async function AccountSelectionClientWrapper({ method }: { method: string }) {
  const accounts = await getAccounts();

  return (
    <>
      {accounts.length > 0 ? (
        <AccountSelectionClient method={method} accounts={accounts} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NoPaymentMethodsPage />
        </motion.div>
      )}
    </>
  );
}
