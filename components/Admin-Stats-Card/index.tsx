"use client";

import { motion } from "framer-motion";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Suspense } from "react";

export function StatsCards() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      increasing: true,
      icon: DollarSign,
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+12.3%",
      increasing: true,
      icon: Users,
    },
    {
      title: "Payment Methods",
      value: "12",
      change: "+2",
      increasing: true,
      icon: CreditCard,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.4%",
      increasing: false,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<div>Loading...</div>}>
        {stats.map((stat, index) => (
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
        ))}
      </Suspense>
    </div>
  );
}
