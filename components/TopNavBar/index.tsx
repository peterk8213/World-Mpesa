"use client";

import { Bell, Share2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { MiniKit } from "@worldcoin/minikit-js";
const MotionButton = motion.create(Button);

const sendHapticFeedbackCommand = () =>
  MiniKit.commands.sendHapticFeedback({
    hapticsType: "impact",
    style: "light",
  });

const NavBar = () => {
  return (
    <div className="bg-white/[0.6] dark:bg-gray-950/[0.6] backdrop-blur-xl border-none fixed top-0 left-0 right-0 z-10">
      <header className="flex justify-between items-center p-4 mb-4">
        <Link href={"/share"}>
          <MotionButton
            variant="ghost"
            size="icon"
            className="rounded-full  "
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={sendHapticFeedbackCommand}
          >
            <Share2 className="h-8 w-8 text-black" />
          </MotionButton>
        </Link>
        <h1 className="text-xl font-medium">NEKRON</h1>
        <Link href={"#"}>
          <MotionButton
            variant="ghost"
            size="icon"
            className="rounded-full  "
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Bell className="h-10 w-10 text-black" />
          </MotionButton>
        </Link>
      </header>
    </div>
  );
};
export default NavBar;
