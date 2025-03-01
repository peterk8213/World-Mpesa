"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

type HomePageAnalyticsProps = { name: string; amount: number };

export function HomePageAnalytics(data: HomePageAnalyticsProps[]) {
  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--primary))",
      formatter: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value),
    },
  };
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams().toString());

  const period =
    (searchParams.get("timeframe") as "daily" | "weekly" | "monthly") ||
    "weekly";

  function updateTimeframe(timeframe: string) {
    searchParams.set("timeframe", timeframe);
    router.push(`${pathname}?${searchParams.toString()}`, { scroll: false });
  }

  const { data: newdata } = data;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold tracking-tight p-3">ANALYTICS</h3>
        <div className="flex items-center justify-between">
          <div className="flex p-1 gap-1 bg-muted rounded-full">
            {(["daily", "weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => updateTimeframe(p)}
                className={cn(
                  "px-4 py-1.5 text-sm rounded-full transition-colors",
                  period === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl  bg-card p-1">
          <div className="h-[240px] w-full">
            <ChartContainer config={chartConfig}>
              <AreaChart
                data={newdata}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                  dx={-10}
                  tickFormatter={(value) => `$${value / 1}`}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#gradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
