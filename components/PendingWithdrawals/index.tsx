"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Use ChevronRight for the arrow
import { Card, CardContent } from "@/components/ui/card"; // Keep using Card for structure
import { cn } from "@/lib/utils";

interface PendingWithdrawalsProps {
  count: number;
  balance?: number; // Optional balance prop
}

const PendingWithdrawals: React.FC<PendingWithdrawalsProps> = ({
  count,
  balance,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const previousCountRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Only animate if the count has changed and is greater than 0
    if (
      previousCountRef.current !== undefined &&
      previousCountRef.current !== count &&
      count > 0
    ) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000); // Pulse for 1 second
      return () => clearTimeout(timer);
    }
    previousCountRef.current = count;
  }, [count]);

  const withdrawalText = count === 1 ? "withdrawal" : "withdrawals";

  return (
    <div>
      <div className="flex flex-col space-y-2 py-2">
        <h3 className="text-xl font-medium mb-6">Activity</h3>
      </div>
      <Link
        // href="/withdrawals/pending"
        href={"#"}
        className={cn(
          "block w-full max-w-md mx-auto cursor-pointer rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ",
          isAnimating && "animate-pulse"
        )}
      >
        <Card className="bg-card text-card-foreground border-none">
          <CardContent className="p-3 flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-2">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-500"></span>
              <span className="text-sm font-medium text-foreground">
                {count} {withdrawalText} processing
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default PendingWithdrawals;
