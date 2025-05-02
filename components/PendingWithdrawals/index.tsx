"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Hourglass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PendingWithdrawalsProps = {
  count: number;
};

export default function PendingWithdrawals({ count }: PendingWithdrawalsProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const previousCountRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (
      previousCountRef.current !== undefined &&
      previousCountRef.current !== count &&
      count > 0
    ) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    previousCountRef.current = count;
  }, [count]);

  if (count <= 0) return null;

  return (
    <Link
      href="/withdraw/pending"
      className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:no-underline"
    >
      <Card
        className={cn(
          "inline-block w-auto cursor-pointer transition-shadow hover:shadow-md",
          isAnimating && "animate-pulse"
        )}
      >
        <CardContent className="flex items-center space-x-3 p-3">
          <Hourglass className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">
              Pending Withdrawals:
            </span>
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
              {count}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
