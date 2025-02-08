"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, CreditCard, Info, ArrowRight } from "lucide-react";
import type { WithdrawalMethod as WithdrawalMethodType } from "@/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function WithdrawalMethod({ method }: { method: WithdrawalMethodType }) {
  const router = useRouter();

  const handleSelect = () => {
    if (method.available) {
      router.push(`/withdraw/account?method=${method.id}`);
    }
  };

  return (
    <motion.div
      whileHover={method.available ? { scale: 1.02 } : {}}
      whileTap={method.available ? { scale: 0.98 } : {}}
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          method.available
            ? "bg-card hover:shadow-md cursor-pointer"
            : "bg-muted/50"
        }`}
        onClick={handleSelect}
      >
        <div className="relative p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-full ${
                  method.available ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <Image
                  src={method.iconUrl || "https://placehold.co/32x32"}
                  alt={`${method.name.slice(0, 2)}`}
                  width={32}
                  height={32}
                />
              </div>
              <h3
                className={`text-lg font-medium ${
                  method.available ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {method.name}
              </h3>
            </div>
            {!method.available && (
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground"
              >
                Coming Soon
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {method.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {method.minAmount && method.maxAmount && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  ${method.minAmount.toLocaleString()} - $
                  {method.maxAmount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{method.processingTime}</span>
            </div>
            {method.fees && (
              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Fees: {method.fees}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            {method.available ? (
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Select <ArrowRight className="w-4 h-4 ml-1" />
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Unavailable
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
