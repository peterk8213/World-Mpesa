import { ArrowDown, ArrowUp } from "lucide-react";
import { Chip } from "@worldcoin/mini-apps-ui-kit-react/Chip";

interface TransactionItemProps {
  title: string;
  subtitle: string;
  amount: number;
  type: "debit" | "credit";
  createdAt: string;
  meta?: {};
  status?: string;
}

export function TransactionItem({
  title,
  subtitle,
  amount,
  type,
  createdAt,
  meta,
  status,
}: TransactionItemProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <TransactionIcon type={type} />
      <TransactionInfo
        title={title}
        subtitle={subtitle}
        createdAt={createdAt}
        status={status || ""}
      />
      <TransactionAmount amount={amount} type={type} />
    </div>
  );
}

function TransactionIcon({ type }: { type: "debit" | "credit" }) {
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F5F5] text-[#333]">
      {type === "debit" ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      )}
    </div>
  );
}

function TransactionInfo({
  title,
  subtitle,
  createdAt,
  status,
}: {
  title: string;
  subtitle: string;
  createdAt: string;
  status: string;
}) {
  return (
    <div className="flex-1">
      <h3 className="font-medium text-black leading-none mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 ">
          <span className="text-sm text-gray-400">
            {
              /// i need such 23/12/23
              new Date(createdAt).toLocaleDateString([], {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })
            }
          </span>

          <span className="text-sm text-gray-400">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {/* <div className="p-2 text-xs">
          <Chip
            label={status.slice(0, 1).toUpperCase() + status.slice(1)}
            variant={
              (() => {
                if (status === "completed") {
                  return "success";
                } else if (status === "failed") {
                  return "error";
                } else if (status === "submitted") {
                  return "default";
                }
              })() || "default"
            }
            className="text-xs opacity-90 font-normal"
          ></Chip>
        </div> */}
      </div>
    </div>
  );
}

function TransactionAmount({
  amount,
  type,
}: {
  amount: number;
  type: "credit" | "debit";
}) {
  return (
    <div className="text-right">
      <p className="font-medium text-black leading-none mb-1">
        {type == "credit" ? "+" : "-"}${Math.abs(amount).toLocaleString()}
      </p>
    </div>
  );
}
