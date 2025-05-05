"use client";

import { motion } from "framer-motion";
import { AlertCircle, Check, Copy, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  amount: string;
  currency: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  address,
  amount,
  currency,
  onConfirm,
}: ConfirmDialogProps) {
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format address for display (show first 10 and last 8 characters)
  const formatAddress = (addr: string) => {
    if (addr.length <= 20) return addr;
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`;
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Confirm Refund Request
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription asChild>
          <div className="space-y-4 py-2">
            <p className="text-gray-700">
              Please review your refund request details:
            </p>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-gray-500 block mb-1">
                  Address (Worldchain):
                </span>
                <div className="flex items-center gap-2 bg-white p-2 rounded border">
                  <span className="font-medium font-mono text-sm truncate">
                    {showFullAddress ? address : formatAddress(address)}
                  </span>
                  <div className="flex-shrink-0 ml-auto">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setShowFullAddress(!showFullAddress)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {showFullAddress
                              ? "Show less"
                              : "Show full address"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">${amount} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Receiving:</span>
                <span className="font-medium">{currency}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Once submitted, this transaction cannot be modified. Please
                ensure all details are correct.
              </p>
            </div>
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-black text-white rounded-full font-medium flex items-center justify-center gap-2"
            onClick={handleConfirm}
          >
            <Check className="h-4 w-4" />
            Confirm Transaction
          </motion.button>

          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
