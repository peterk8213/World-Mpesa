"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);

export const RefreshButton = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh(); // Works in App Router to revalidate
  };

  return (
    <MotionButton
      variant="ghost"
      className="flex items-center gap-2 rounded-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={handleRefresh}
    >
      <RotateCcw className="h-4 w-4" />
      Refresh
    </MotionButton>
  );
};
