import { getTransactions } from "@/lib/transactions";
import { TransactionItem } from "@/components/TransactionItem";
import Link from "next/link";

export async function HistoryList() {
  const transactions = await getTransactions();

  return (
    <ul className="space-y-4 bg-white scrollbar-hide lg:px-10 mb-12">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </ul>
  );
}
