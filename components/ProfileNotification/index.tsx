"use client";

import {
  Bell,
  ChevronRight,
  HelpCircle,
  Info,
  Lock,
  MessageSquare,
  Settings,
  Shield,
  Volume2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

import { useState } from "react";
import { motion } from "framer-motion";

export function ProfileNotification() {
  const [notifications, setNotifications] = useState({
    all: true,
    messages: true,
    sounds: false,
  });

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <h3 className="text-lg font-medium">Notifications</h3>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 1.05, opacity: 0.8, z: 2 }}
      >
        <div className="space-y-4 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 p-2 dark:bg-gray-700">
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="font-medium">All Notifications</p>
                <p className="text-sm text-gray-500">
                  Enable or disable all alerts
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.all}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, all: checked }))
              }
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
