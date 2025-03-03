"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, ChevronRight, Zap } from "lucide-react";
import type { WithdrawalMethod as WithdrawalMethodType } from "@/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toastInfo, toastSuccess } from "@/lib/toast";

export function WithdrawalMethod({ method }: { method: WithdrawalMethodType }) {
  const router = useRouter();
  const handleSelect = () => {
    if (!method.available) {
      toastInfo("This withdrawal method is coming soon!");
      return;
    }
    router.push(`/withdraw/account?method=${encodeURIComponent(method._id)}`);
    toastSuccess(`${method.name} selected  ⚡⚡`);
    return;
  };

  return (
    <motion.div
      whileHover={method.available ? { scale: 1.02 } : {}}
      whileTap={method.available ? { scale: 0.98 } : {}}
      onClick={() => {
        handleSelect();
      }}
      className={`${
        method.available
          ? "hover:shadow-sm cursor-pointer bg-neutral-50"
          : "bg-muted/60"
      } rounded-3xl  border z-10 flex items-center p-8  border-white  `}
    >
      {/* Icon container */}
      <div
        className={
          "flex-shrink-0 w-12 h-20 rounded-lg overflow-hidden flex items-center justify-center  transition-transform duration-200 "
        }
      >
        <div className="relative w-12 h-20 z-50">
          <Image
            src={
              method.iconUrl ||
              "https://kzmncqd2l1uepckz6iq7.lite.vusercontent.net/placeholder.svg?height=48&width=48"
            }
            alt={method.name.slice(0, 4)}
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 ml-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-medium font-rubik">{method.name}</h3>

            <p className="mt-0.5 text-sm text-gray-500 font-rubik line-clamp-1">
              {method.description}
            </p>
          </div>
        </div>

        {/* Details row */}
        <div className="mt-2 flex items-center gap-4 ">
          {/* Processing time with icon */}
          <span className="flex items-center text-sm  ">
            {method.processingTime.includes("Instant") ? (
              <Zap className="w-3.5 h-3.5 mr-1 text-green-600" />
            ) : (
              <Clock className="w-3.5 h-3.5 mr-1 text-amber-700" />
            )}
            {method.processingTime}
          </span>

          {method.available && (
            <span className="text-sm text-gray-500">
              ${method.minAmount.toLocaleString()} - $
              {method.maxAmount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Right arrow for enabled methods */}
      {method.available && (
        <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400 ml-2 transition-transform duration-200" />
      )}

      {/* Coming soon label */}
      {!method.available && (
        <span className="ml-auto text-sm font-medium text-gray-500">
          Coming Soon!
        </span>
      )}
    </motion.div>
  );
}
