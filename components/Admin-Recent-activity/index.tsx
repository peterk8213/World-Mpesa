"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type React from "react"; // Import React

interface RecentActivityProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Activity {
  totalDeposits: number;
  totalWithdrawals: number;
  activeUsers: number;
}

export function RecentActivity({
  className,
  activeUsers,
  totalDeposits,
  totalWithdrawals,
  ...props
}: RecentActivityProps & Activity) {
  const activities = [
    {
      name: "Total Deposits Count",

      amount: `${totalDeposits}`,
    },
    {
      name: "Total Withdrawals Count",

      amount: `${totalWithdrawals}`,
    },

    {
      name: "Active Users",

      amount: `${activeUsers}`,
    },
  ];
  return (
    <Card className={className || ""}>
      <CardHeader>
        <CardTitle>More Activity</CardTitle>
        <CardDescription>Track App Activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.name}
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.name}
                </p>
              </div>
              <div className="ml-auto font-medium">{activity.amount}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
