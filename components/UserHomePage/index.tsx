"use client";

import { motion } from "framer-motion";
import { Plus, Settings, Coins, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Typography } from "@worldcoin/mini-apps-ui-kit-react/Typography";

import { formatWithoutRounding } from "@/lib/formatBalance";

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
            {balance > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center  gap-[2rem]">
                  <p className="text-sm text-gray-400">Available Balance</p>
                </div>
                <div className="flex items-baseline gap-[2rem]">
                  <div className="flex items-baseline gap-2">
                    {(() => {
                      const formattedBalance = formatWithoutRounding(
                        balance,
                        2
                      ).split(".");
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
            ) : (
              // Show Deposit Feature
              <div className="flex flex-col items-center justify-center text-center space-y-3 md:space-y-4 py-2 md:py-8">
                <Coins className="h-10 w-10 md:h-12 md:w-12 text-gray-500" />

                <p className="text-xs md:text-sm text-gray-400 max-w-xs px-4">
                  Make your first deposit to start managing your funds.
                </p>
                <Button
                  asChild
                  variant="secondary" // Use a contrasting but fitting variant
                  className="mt-3 md:mt-4 bg-white text-black hover:bg-gray-200 rounded-full px-6 py-2 text-sm md:text-base" // Style to match dark theme contrast, rounded-full
                >
                  <Link href="/deposit">
                    <Plus className="mr-2 h-4 w-4" /> Deposit Now
                  </Link>
                </Button>
              </div>
            )}
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
