"use client";

import { useRouter } from "next/navigation";
import { X, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  leftIcon?: React.ReactNode;
}
const MotionButton = motion.create(Button);

export function Header({ title, showLogo = true, leftIcon }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between p-4 border-b  fixed top-0 left-0 right-0 z-50">
      <MotionButton
        variant="ghost"
        size="icon"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => router.back()}
      >
        {leftIcon}
      </MotionButton>
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
      <div>
        <MotionButton
          variant="ghost"
          size="icon"
          className="rounded-full text-black"
          onClick={() => router.push("/home")}
        >
          <X className="w-6 h-6" />
        </MotionButton>
      </div>
    </header>
  );
}
