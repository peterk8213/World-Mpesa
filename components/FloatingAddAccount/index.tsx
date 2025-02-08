import { Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FloatingAddButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className=""
    >
      <Link href="/add-account" className="block">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </Link>
    </motion.div>
  );
}
