"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href || "#"}>
      <motion.div
        whileHover={{ scale: 0.95 }}
        whileTap={{ scale: 0.9 }}
        key={title}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-[2rem] bg-gray-50/50 backdrop-blur-sm p-6 text-left transition-colors hover:bg-gray-50"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              {Icon}
            </div>
            <motion.div
              whileHover={{ x: 5, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
          <div>
            <h3 className="font-medium mb-1 hover:decoration-black">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.02] transition-opacity group-hover:opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent 0%, transparent calc(100% - 1px), black calc(100% - 1px)), 
                        linear-gradient(180deg, transparent 0%, transparent calc(100% - 1px), black calc(100% - 1px))`,
              backgroundSize: "2rem 2rem",
            }}
          />
        </div>
      </motion.div>
    </Link>
  );
}
