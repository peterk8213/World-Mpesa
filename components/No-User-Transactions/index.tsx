"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const MotionButton = motion.create(Button);

export function EmptyTransactions() {
  return (
    <div className="w-full max-w-sm mx-auto p-6 min-h-[300px] flex flex-col justify-center bg-white gap-4 ">
      <div className="space-y-4 flex flex-col items-center justify-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            scale: {
              type: "spring",
              damping: 15,
              stiffness: 200,
            },
          }}
        >
          <motion.div
            className="relative z-10 rounded-full p-4"
            initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              type: "spring",
              damping: 12,
            }}
          >
            <CreditCard size={40} className="text-zinc-900" />
          </motion.div>
        </motion.div>
        <motion.div
          className="space-y-2 text-center w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <motion.h2
            className="text-lg text-zinc-900 tracking-tight font-medium"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            No Transactions Yet
          </motion.h2>
          <motion.p
            className="text-sm text-zinc-500 max-w-[250px] mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            You haven't made any currency transfers. Your first transactions
            will appear here.
          </motion.p>
        </motion.div>
      </div>
      <div className="pt-2 pb-0 px-0">
        <motion.div
          className="w-full"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <MotionButton
            className="w-full   flex items-center gap-2 rounded-full"
            variant={"secondary"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Make First Transfer
          </MotionButton>
        </motion.div>
      </div>
    </div>
  );
}
