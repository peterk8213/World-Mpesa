"use client";
import { motion } from "framer-motion";

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
  className?: string;
  isbold?: boolean;
}

export function InfoItem({
  label,
  value,
  highlight = false,
  icon,
  className = "",
}: InfoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center `}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between w-full px-4 py-3 border-b border-gray-200 last:border-b-0"
      >
        {/* Left side: Label and Value */}
        <div className="flex items-center gap-6 w-full">
          <div>
            <div className="flex items-center space-x-2">
              {icon && <div className="text-gray-500">{icon}</div>}
              <p className="text-sm text-gray-500">{label}</p>

              <p
                className={`text-base  ${className} ${
                  highlight ? "font-semibold text-pink-500" : "text-gray-900"
                }`}
              >
                {value}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
