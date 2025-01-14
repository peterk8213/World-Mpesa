import { ArrowUpRight, ArrowDownLeft, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type TransactionType = "deposit" | "withdrawal" | "send";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
}

const typeIcons = {
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  send: Send,
};

const typeColors = {
  deposit: "text-green-400",
  withdrawal: "text-red-400",
  send: "text-blue-400",
};

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const Icon = typeIcons[transaction.type];

  return (
    <Card className="bg-gray border-gray-300 lg:mx-20 backdrop:blur-sm">
      <CardContent className="p-4 flex items-center justify-between ">
        <div className="flex items-center">
          <div
            className={`p-2 rounded-full ${
              typeColors[transaction.type]
            } bg-opacity-20 mr-3`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-black capitalize">
              {transaction.type}
            </p>
            <p className="text-sm text-gray-400">{transaction.date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-medium italic ${typeColors[transaction.type]}`}>
            {transaction.type === "deposit" ? "+" : "-"}
            {transaction.amount} {transaction.currency}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
