"use client";

import { useState, useRef } from "react";
import { Copy, Check, Share2, ChevronLeft, LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  // Mock share data - in a real app this would come from your API or state
  const shareData = {
    message:
      "I just sent money using this fast and secure transfer app! Try it out.",
    link: process.env.APP_URL ?? "https://example.com",
  };

  const copyToClipboard = () => {
    if (linkRef.current) {
      linkRef.current.select();
      navigator.clipboard.writeText(shareData.link);
      setCopied(true);

      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white p-6">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">Share</h1>
        </div>

        {/* Share Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Share2 className="h-10 w-10 text-gray-600" />
          </div>
        </motion.div>

        {/* Share Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Share with Friends
          </h2>
          <p className="text-gray-600">{shareData.message}</p>
        </motion.div>

        {/* Share Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <label
            htmlFor="share-link"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Share this link
          </label>
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black">
            <div className="flex h-12 items-center px-3 text-gray-400">
              <LinkIcon className="h-4 w-4" />
            </div>
            <input
              ref={linkRef}
              id="share-link"
              type="text"
              readOnly
              value={shareData.link}
              className="h-12 flex-1 border-0 bg-transparent focus:outline-none focus:ring-0"
            />
            <button
              onClick={copyToClipboard}
              className="flex h-full items-center justify-center px-4 text-gray-500 transition-colors hover:text-gray-700"
              aria-label="Copy to clipboard"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="h-5 w-5 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-sm text-green-500"
              >
                Link copied to clipboard!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"
        >
          <p className="text-sm text-gray-600">
            Tap the copy icon to copy the link, then paste it in your preferred
            messaging app to share with friends.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
