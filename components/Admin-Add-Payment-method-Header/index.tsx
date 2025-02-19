"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);

export function AddPaymentMethodHeader() {
  return (
    <header className="sticky top-0 z-10  border-b  py-1 w-full">
      <div className="container  mx-auto px-6 flex items-center justify-end">
        <div>
          <MotionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            variant={"ghost"}
            size="icon"
          >
            <Link href="/admin-only-page/" className="p-1">
              <X className="w-6 h-6" />
            </Link>
          </MotionButton>
        </div>
      </div>
    </header>
  );
}
