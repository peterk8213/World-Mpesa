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

const activities = [
  {
    name: "PayPal Transfer",
    description: "Processing time: 1-2 days",
    amount: "+$1,999.00",
    avatar: "/avatars/01.png",
    fallback: "PP",
    timestamp: "2 minutes ago",
  },
  {
    name: "Stripe Payment",
    description: "Processing time: Instant",
    amount: "+$39.00",
    avatar: "/avatars/02.png",
    fallback: "ST",
    timestamp: "5 minutes ago",
  },
  {
    name: "Bank Transfer",
    description: "Processing time: 2-3 days",
    amount: "+$299.00",
    avatar: "/avatars/03.png",
    fallback: "BA",
    timestamp: "10 minutes ago",
  },
];

interface RecentActivityProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentActivity({ className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest transactions across all methods
        </CardDescription>
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
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.avatar} alt={activity.name} />
                <AvatarFallback>{activity.fallback}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
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
