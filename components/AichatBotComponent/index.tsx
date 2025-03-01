"use client";

import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Construction } from "lucide-react";

import { Chip } from "@worldcoin/mini-apps-ui-kit-react/Chip";

export function AichatBotComponent() {
  return (
    <Link href={"#"}>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className=""
      >
        <div className="rounded-3xl bg-gray-50 p-6 flex flex-col ">
          <div className="flex items-center justify-start mb-2">
            <Chip
              variant="default"
              label="Coming soon"
              className="p-2 "
              icon={<Construction />}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">AI Assistant</h3>
              <p className="text-sm text-gray-500">
                Smart, fast, and ready to help with anything you need.
              </p>
            </div>
            <button className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.section>
    </Link>
  );
}
