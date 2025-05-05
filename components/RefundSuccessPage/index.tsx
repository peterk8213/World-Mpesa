"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Copy, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RatingDialog } from "@/components/RatingDrawer";

interface SuccessPageProps {
  transactionId: string;
  amount: string;
  currency: string;
  address: string;
  onDone: () => void;
}

export function SuccessPage({
  transactionId,
  amount,
  currency,
  address,
  onDone,
}: SuccessPageProps) {
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  // Show rating dialog when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRatingDialog(true);
    }, 1000); // Show after 1 second for better UX

    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format address for display (show first 10 and last 8 characters)
  const formatAddress = (addr: string) => {
    if (addr.length <= 20) return addr;
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white p-4 border-b">
        <div className="flex items-center">
          <Link href="/" className="p-2 rounded-full bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold ml-4">Transaction Successful</h1>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-8"
        >
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.2,
              }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>

            <h2 className="text-2xl font-bold text-center">
              Refund Request Submitted
            </h2>
            <p className="text-gray-500 text-center mt-2">
              Your refund request has been successfully submitted
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <p className="font-medium font-mono">{transactionId}</p>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">${amount} USD</p>
            </div>

            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Receiving</p>
              <p className="font-medium">{currency}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Address</p>
              <div className="flex items-center gap-1">
                <p className="font-medium font-mono truncate max-w-[150px]">
                  {showFullAddress ? address : formatAddress(address)}
                </p>
                <button
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <Eye className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-sm">
                Processing
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2 mt-0.5">
              <ExternalLink className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Processing Time</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your refund is being processed. The amount will be credited to
                your Worldchain wallet within 24-48 hours. You'll receive a
                notification once the transaction is complete.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 bg-black text-white rounded-full font-medium mt-8"
            onClick={onDone}
          >
            Done
          </motion.button>
        </motion.div>
      </main>

      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
      />
    </div>
  );
}
