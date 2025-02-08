"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PaymentAccount as PaymentAccountType } from "@/types";

interface AccountProps {
  account: PaymentAccountType;
  selected: boolean;
  onSelect: () => void;
}

export default function WithdrawAccountCard({
  account,
  selected,
  onSelect,
}: AccountProps) {
  const { id, provider, phoneNumber, holderName, addedOn } = account;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProviderStyles = (provider: string) => {
    switch (provider) {
      case "mpesa":
        return {
          badge: "bg-[#E8F5E9] text-green-700",
          card: "bg-green-50/40",
        };
      case "airtel":
        return {
          badge: "bg-[#FFEBEE] text-red-700",
          card: "bg-red-50/40",
        };
      case "bank":
        return {
          badge: "bg-[#E3F2FD] text-blue-700",
          card: "bg-blue-50/40",
        };
      default:
        return {
          badge: "bg-[#F5F5F5] text-gray-700",
          card: "bg-gray-50/40",
        };
    }
  };

  const styles = getProviderStyles(provider);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.card} rounded-xl p-5 cursor-pointer transition-all ${
        selected
          ? "ring-1 ring-black "
          : "ring-1 ring-gray-200 backdrop-blur-sm "
      }`}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <h3 className="text-base font-medium">{holderName}</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm text-black/70">{phoneNumber}</p>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${styles.badge}`}
              >
                {provider}
              </span>
              <span className="text-xs text-black/50">
                Added {formatDate(addedOn)}
              </span>
            </div>
          </div>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
