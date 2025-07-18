"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Star, MoreVertical } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@worldcoin/mini-apps-ui-kit-react/Drawer";
import { Button } from "@/components/ui/button";

export function RatingDialog() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  useEffect(() => {
    const hasSeenRateModal = localStorage.getItem("hasSeenRateModal");
    console.log("hasSeenRateModal", hasSeenRateModal);

    if (!hasSeenRateModal) {
      // need like a timeout to show the modal after a few seconds
      setTimeout(() => {
        setShowRateModal(true);
      }, 5000); // show modal after 5 seconds
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenRateModal", "true");

    setShowRateModal(false);
  };

  const handleRate = () => {
    setShowInstructions(true);
  };

  return (
    <Drawer open={showRateModal} onOpenChange={handleClose}>
      <DrawerContent className="max-w-md  min-h-[200px] flex flex-col justify-around pb-4">
        <div className="space-y-4 py-2 ">
          {!showInstructions ? (
            <div className="flex justify-between items-center">
              <p className="text-center text-gray-700">
                Enjoying the app? Please rate us with 5 stars!
              </p>
              <div className="flex justify-center my-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-8 w-8 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-center text-gray-700">To rate our app:</p>
              <ol className="text-sm text-gray-700 space-y-3 ml-2">
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Tap on the three dots{" "}
                    <MoreVertical className="h-4 w-4 inline" /> in the top right
                    corner of your screen
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Select "Rate " from the menu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Give us 5 stars to support our development</span>
                </li>
              </ol>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-6 w-6 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
        <div className="flex justify-between items-center px-4 py-2 border-t border-slate-200">
          {!showInstructions ? (
            <Button
              onClick={handleRate}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-full"
            >
              Rate Now
            </Button>
          ) : (
            <Button
              onClick={() => handleClose()}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-full"
            >
              Got It
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
