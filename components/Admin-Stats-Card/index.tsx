"use client";

import { motion, number } from "framer-motion";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWithoutRounding } from "@/lib/formatBalance";

import { Suspense } from "react";

interface StatsCardProps {
  totalDeposits: number;
  totalWithdrawals: number;
  totalRevenue: number;

  totalUsers: number;
  totalWalletBalances: number;
  totalActualCharges: number;
  totalPayout: number;
}

export function StatsCards({ props }: { props: StatsCardProps }) {
  const {
    totalDeposits,
    totalUsers,
    totalWithdrawals,
    totalWalletBalances,
    totalRevenue,
    totalActualCharges,
    totalPayout,
  } = props;
  const stats = [
    {
      title: "Total Revenue",
      value: formatWithoutRounding(totalRevenue, 2),
      change: "+20.1%",
      increasing: true,
      icon: DollarSign,
    },
    {
      title: "Total  Users",
      value: `${totalUsers}`,
      change: "+12.3%",
      increasing: true,
      icon: Users,
    },

    {
      title: "Total Deposits",
      value: `$${totalDeposits}`,
      change: "+2",
      increasing: true,
      icon: CreditCard,
    },
    {
      title: "Total Withdrawals",
      value: `$${totalWithdrawals}`,
      change: "+20.1%",
      increasing: true,
      icon: DollarSign,
    },
    {
      title: "Wallets Balances",
      value: `${totalWalletBalances}`,
      change: "+12.3%",
      increasing: true,
      icon: DollarSign,
    },
    {
      title: "Total Payouts",
      value: formatWithoutRounding(totalPayout, 2),
      change: "+2.3%",
      increasing: true,
      icon: DollarSign,
    },
    {
      title: "Transaction Fees (KES)",
      value: formatWithoutRounding(totalActualCharges, 2),
      change: "+2.3%",
      increasing: true,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<div>Loading...</div>}>
        {stats.map((stat, index) => {
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs ${
                        stat.increasing ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    {stat.increasing ? (
                      <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 h-1 w-full ${
                      stat.increasing
                        ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/40"
                        : "bg-gradient-to-r from-red-500/20 to-red-500/40"
                    }`}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Suspense>
    </div>
  );
}
