import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BanknoteIcon as Bank, Smartphone, CreditCard } from "lucide-react";
import type { WithdrawalMethod } from "@/types";
import { motion } from "framer-motion";

const iconMap = {
  Bank,
  Smartphone,
  CreditCard,
};

export default function WithdrawalMethods({
  methods,
}: {
  methods: WithdrawalMethod[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 xl:w-full mt-4"
    >
      {methods.map((method, index) => {
        const Icon = iconMap[method.icon as keyof typeof iconMap];
        return (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              key={method.id}
              href={
                method.available ? `/withdraw/amount?method=${method.id}` : "#"
              }
              className={`block ${!method.available && "pointer-events-none"}`}
            >
              <motion.div
                className="cursor-pointer w-full"
                whileHover={method.available ? { scale: 1.03 } : {}}
                whileTap={method.available ? { scale: 0.98 } : {}}
              >
                <Card
                  className={`transition-all hover:shadow-md ${
                    method.available ? "" : "opacity-60"
                  } w-full`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {method.name}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {method.available ? (
                      <CardDescription>Click to select</CardDescription>
                    ) : (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
