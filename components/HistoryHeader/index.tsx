"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function HistoryHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white border-b ">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-black"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-semibold text-black">Transaction History</h1>
      <div className="w-10 h-10" />
    </header>
  );
}
