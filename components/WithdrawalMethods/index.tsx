"use client";

import type { WithdrawalMethod as WithdrawalMethodType } from "@/types";
import { WithdrawalMethod } from "@/components/WithdrawMethodsCard";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function WithdrawalMethods({
  methods,
}: {
  methods: WithdrawalMethodType[];
}) {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {methods.map((method) => (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          key={method._id}
          variants={item}
        >
          <WithdrawalMethod method={method} />
        </motion.div>
      ))}
    </motion.div>
  );
}
