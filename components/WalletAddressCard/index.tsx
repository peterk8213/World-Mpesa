"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Eye, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddressCardProps {
  id: string;
  address: string;
  fullAddress: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function AddressCard({
  id,
  address,
  fullAddress,
  label,
  selected,
  onSelect,
}: AddressCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const displayAddress = expanded ? fullAddress : address;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-4 rounded-xl border cursor-pointer",
        selected ? "border-black bg-gray-50" : "border-gray-200"
      )}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white">
          <Wallet className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium font-mono truncate">{displayAddress}</p>
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={toggleExpand}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <Eye className="h-4 w-4" />
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={copyToClipboard}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy address"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-sm truncate">{label}</p>
            <span className="text-xs px-2 py-0.5 bg-gray- text-gray-600 rounded-full flex-shrink-0">
              Worldchain
            </span>
          </div>
        </div>
        {selected && <Check className="ml-auto h-5 w-5 text-green-500" />}
      </div>
    </motion.div>
  );
}
