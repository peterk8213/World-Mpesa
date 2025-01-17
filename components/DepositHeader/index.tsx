"use client";

import { useRouter } from "next/navigation";
import { Heart, MoreVertical, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  leftIcon?: React.ReactNode;
}

export function Header({ title, showLogo = true, leftIcon }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Button variant="ghost" size="icon" onClick={() => useRouter().back()}>
        {leftIcon}
      </Button>
      {showLogo ? (
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">Deposit</span>
        </div>
      ) : (
        <h1 className="text-xl font-semibold">{title}</h1>
      )}
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-6 w-6" />
      </Button>
    </header>
  );
}
