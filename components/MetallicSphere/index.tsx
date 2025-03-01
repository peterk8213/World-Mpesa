"use client";

import { motion } from "framer-motion";

export function MetallicSphere() {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute flex items-center justify-center "
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-4 bg-slate-200/50 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <div className="w-32 h-32 rounded-full bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 flex items-center justify-center shadow-lg">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
