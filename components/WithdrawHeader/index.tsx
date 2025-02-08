"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function WithdrawHeader({ title, showBackButton = true }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("/amount")) return "Withdraw Amount";
    if (pathname.includes("/checkout")) return "Checkout";
    return title;
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border py-4">
      <div className="container max-w-6xl mx-auto px-4 flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-black"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{getTitle()}</h1>
      </div>
    </header>
  );
}
