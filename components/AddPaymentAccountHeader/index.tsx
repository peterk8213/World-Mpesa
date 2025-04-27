"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

const MotionButton = motion.create(Button);

export function AddPaymentAccountHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10  border-b  py-2 w-full">
      <div className="container   px-6 flex items-center justify-end">
        <div>
          <MotionButton
            variant="ghost"
            size="icon"
            className="rounded-full "
            onClick={() => router.back()}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <X className="w-6 h-6 text-black" />
          </MotionButton>
        </div>
      </div>
    </header>
  );
}
