"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionButton = motion.create(Button);
//// i need to see a loading state when refreshing and have a small delay

export const RefreshButton = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleRefresh = () => {
    try {
      setIsLoading(true);
      setIsError(false);
      router.refresh();
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error refreshing:", error);
      setIsError(true);
    }
  };

  return (
    <>
      <MotionButton
        variant="ghost"
        className="flex items-center gap-2 rounded-lg  bg-accent"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={handleRefresh}
      >
        <RotateCcw className="h-4 w-4" />
        Refresh
      </MotionButton>

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 rounded-lg"></div>
      )}
    </>
  );
};
