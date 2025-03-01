"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function TransactionTypeSlector({ type }: { type: string }) {
  const [activeTab, setActiveTab] = useState("all"); // State for active tab
  const router = useRouter();

  return (
    <div>
      {/* Tabs */}

      <div className="bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/50  ">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            router.push(`/history?type=${value}`);
          }}
          className="mb-1 "
        >
          <TabsList
            className="w-full grid grid-cols-4 gap-2 p-1 rounded-none  bg-transparent backdrop-blur-sm"
            color="text-black dark:text-white"
          >
            <TabsTrigger
              value="all"
              className={` focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-b-transparent bg-transparent
              `}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="deposits"
              className=" focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-b-transparent bg-transparent"
            >
              Deposits
            </TabsTrigger>
            <TabsTrigger
              value="expense"
              className=" focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-b-transparent bg-transparent"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="r focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-b-transparent bg-transparent"
            >
              Pending
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
