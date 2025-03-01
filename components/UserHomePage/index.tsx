"use client";

import { motion } from "framer-motion";
import { Plus, Settings, Wallet, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react/Typography";

type User = {
  userName: string;
  balance: number;
  currency: string;
};

export default function UserHomePageCard({ user }: { user: User }) {
  const { userName, balance, currency } = user;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Balance Card */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-[3.0rem] bg-black p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5" />

              <span className="text-sm font-medium ">{userName}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center  gap-[2rem]">
                <p className="text-sm text-gray-400">Available Balance</p>
              </div>
              <div className="flex items-baseline gap-[2rem]">
                <div className="flex items-baseline gap-2">
                  {(() => {
                    const formattedBalance = balance.toFixed(2).split(".");
                    return (
                      <>
                        <h2 className="text-4xl font-semibold tracking-tight">
                          {formattedBalance[0]}
                        </h2>
                        <span className="text-xs text-gray-400">
                          .{formattedBalance[1]}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <span className="text-sm text-gray-400">
                  {currency.toLocaleUpperCase()}
                </span>
              </div>
            </div>
          </div>
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, transparent calc(100% - 1px), white calc(100% - 1px)),
                                linear-gradient(180deg, transparent 0%, transparent calc(100% - 1px), white calc(100% - 1px))`,
                backgroundSize: "4rem 4rem",
              }}
            />
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16" />
        </div>
      </section>
    </motion.div>
  );
}
