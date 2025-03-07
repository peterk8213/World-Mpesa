"use client"; // Mark as client component for interactivity

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import { TransactionItem } from "@/components/TransactionItem";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { EmptyTransactions } from "@/components/No-User-Transactions";

export function HistoryList({ transactions }: { transactions: any[] }) {
  return (
    <div className=" ">
      <div className="container max-w-md mx-auto p-2">
        {/* Transaction List */}
        <div className="h-[calc(100vh-220px)] pr-4 rounded-lg glass-light  scrollbar-hide overflow-auto ">
          <AnimatePresence>
            {Object.entries(transactions).length > 0 ? (
              Object.entries(transactions).map(([date, dateTransactions]) => (
                <div key={date} className="mb-4 z-10">
                  <motion.h2
                    className="text-xs font-medium  sticky top-0  py-2 px-4 rounded-full inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {date}
                  </motion.h2>
                  <div className="space-y-1 mb-[10px]">
                    {(dateTransactions as any[]).map((transaction) => (
                      <motion.div
                        key={transaction._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TransactionItem
                          key={transaction._id}
                          subtitle={transaction.description}
                          title={(() => {
                            if (
                              transaction.type === "debit" &&
                              transaction.method == "mpesa"
                            ) {
                              return `Withdraw to Mpesa`;
                            }
                            if (
                              transaction.type === "credit" &&
                              transaction.method == "worldcoin"
                            ) {
                              return `Worldcoin Deposit`;
                            }
                            if (transaction.type === "send") {
                              return `Send  Money Transaction`;
                            } else {
                              return "";
                            }
                          })()}
                          amount={transaction.amount}
                          type={transaction.type}
                          createdAt={transaction.createdAt}
                          meta={transaction.meta}
                          status={transaction.status}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyTransactions />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
