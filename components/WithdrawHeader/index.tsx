"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const MotionButton = motion.create(Button);

export function WithdrawHeader({ title, showBackButton = true }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("/amount")) return "Amount";
    if (pathname.includes("/checkout")) return "Checkout";
    return title;
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border py-4">
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
        {showBackButton && (
          <div className="flex items-center space-x-2">
            <MotionButton
              variant="ghost"
              size="icon"
              className="rounded-full text-black"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6" />
            </MotionButton>
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
          </div>
        )}

        <div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-black"
            onClick={() => router.push("/home")}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
