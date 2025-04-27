// app/history/page.tsx
import { Suspense } from "react";
import { HistoryList } from "@/components/HistoryList";
import { HistoryHeader } from "@/components/HistoryHeader";

import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

//import { unstable_cache } from "next/cache";
import {
  startOfDay,
  startOfWeek,
  isToday,
  isYesterday,
  format,
  differenceInDays,
} from "date-fns";
import { TransactionTypeSlector } from "@/components/TransactionHistoryTabs";

const getTransactionHistory = async ({
  userId,

  type,
}: {
  userId: string;

  type: string;
}) => {
  // Fetch transaction history from the db

  console.log("Fetching transaction history for", userId, type);
  const transactions = await Transaction.find({
    userId,
    type: (() => {
      if (type === "deposits") {
        return "credit";
      } else if (type === "expense") {
        return { $in: ["debit", "send"] };
      } else {
        return { $in: ["credit", "debit", "send"] };
      }
    })(),
    status: type === "pending" ? "pending" : { $ne: "pending" },
  })

    .select("userId amount method type status description meta createdAt ")
    .sort({ createdAt: -1 })
    .lean();

  /// Get date references
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = startOfDay(now.setDate(now.getDate() - 1));
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday as start of week

  // Group transactions by natural language date
  const groupedTransactions: Record<string, any[]> = {};

  transactions.forEach((txn) => {
    const txnDate = new Date(txn.createdAt);
    let label = "";

    if (isToday(txnDate)) {
      label = "Today";
    } else if (isYesterday(txnDate)) {
      label = "Yesterday";
    } else if (txnDate >= weekStart) {
      label = "Earlier This Week";
    } else if (differenceInDays(todayStart, txnDate) <= 14) {
      label = "Last Week";
    } else {
      label = format(txnDate, "MMMM yyyy"); // Example: "January 2025"
    }

    if (!groupedTransactions[label]) {
      groupedTransactions[label] = [];
    }
    groupedTransactions[label].push(txn);
  });

  return JSON.parse(JSON.stringify(groupedTransactions));
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  ///// 1. Fetch the user session
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  ///// 2. Fetch the user ID from the session
  const { userId } = session;

  ///// 3. Fetch the search params
  const searchParamsData = await searchParams;
  const type = searchParamsData.type || "debit"; // Default to "deposits"

  //////// 5. Return the props

  return (
    <div className="flex flex-col min-h-screen  text-black p-2 gap-1">
      <HistoryHeader />
      <div className=" pt-4 px-4">
        <TransactionTypeSlector type={type} />
      </div>
      <main className="flex-1 p-2">
        <Suspense
          fallback={
            <div className="text-black text-center mt-8">
              Loading transactions...
            </div>
          }
          key={type}
        >
          <HistoryListWrapper userId={userId} type={type} />
        </Suspense>
      </main>
    </div>
  );
}

const HistoryListWrapper = async ({
  userId,

  type,
}: {
  userId: string;

  type: string;
}) => {
  ///// . Fetch the transaction history  and cache for 60 seconds using unsatable_cache
  // const getCachedTransactions = unstable_cache(
  //   getTransactionHistory,
  //   ["transactions", userId, type],
  //   { revalidate: 60 }
  // );

  //const transactions = await getCachedTransactions({ userId, type });
  const transactions = await getTransactionHistory({ userId, type });

  return transactions ? (
    <HistoryList transactions={transactions} />
  ) : (
    <div className="text-black text-center mt-8">No transactions found</div>
  );
};
