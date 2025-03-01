"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter, redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);

export function ProfileNavBar() {
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="fixed top-0 z-50 px-5 left-0 right-0">
      <div className="absolute inset-0 bg-white/[0.6] dark:bg-gray-950/[0.6] backdrop-blur-xl" />
      <header className="relative flex h-16 items-center justify-between px-4 border-b border-gray-200/30 dark:border-gray-800/30">
        <MotionButton
          variant="ghost"
          size="icon"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-full hover:bg-gray-500/10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </MotionButton>

        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
          Profile
        </h1>

        <MotionButton
          variant="ghost"
          size="icon"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-full text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </MotionButton>
      </header>
    </div>
  );
}
