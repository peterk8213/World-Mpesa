"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type React from "react";

import { TrendingUp } from "lucide-react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const data = {
  daily: [
    { date: "Mon", profit: 12400 },
    { date: "Tue", profit: 14405 },
    { date: "Wed", profit: 19400 },
    { date: "Thu", profit: 18200 },
    { date: "Fri", profit: 17000 },
    { date: "Sat", profit: 21600 },
    { date: "Sun", profit: 23400 },
  ],
  weekly: [
    { date: "Week 1", profit: 65400 },
    { date: "Week 2", profit: 74405 },
    { date: "Week 3", profit: 89400 },
    { date: "Week 4", profit: 98200 },
  ],
  monthly: [
    { date: "Jan", profit: 234000 },
    { date: "Feb", profit: 254405 },
    { date: "Mar", profit: 289400 },
    { date: "Apr", profit: 298200 },
    { date: "May", profit: 327000 },
    { date: "Jun", profit: 321600 },
  ],
};

interface ProfitChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ProfitChart({ className }: ProfitChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Net Profit Overview</CardTitle>
        <CardDescription>Track your profit trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          {Object.entries(data).map(([key, values]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="h-[250px]  px-2 py-3">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={values}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value: any) =>
                              `$${value.toLocaleString()}`
                            }
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="var(--color-profit)"
                        fill="var(--color-profit)"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Total Profit: $
              {Object.values(data)
                .flat()
                .reduce((sum, item) => sum + item.profit, 0)
                .toLocaleString()}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
