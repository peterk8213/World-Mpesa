import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function UserHomePageCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Balance Card Skeleton */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-[3.0rem] bg-black p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              {/* Skeleton for Icon */}
              <Skeleton className="h-5 w-5" />
              {/* Skeleton for User Name */}
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-[2rem]">
                {/* Skeleton for "Available Balance" label */}
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-baseline gap-[2rem]">
                <div className="flex items-baseline gap-2">
                  {/* Skeleton for formatted balance */}
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-6" />
                </div>
                {/* Skeleton for currency */}
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
          {/* Decorative Pattern Skeleton */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, transparent calc(100% - 1px), white calc(100% - 1px)),
                                linear-gradient(180deg, transparent 0%, transparent calc(100% - 1px), white calc(100% - 1px))`,
                backgroundSize: "4rem 4rem",
              }}
            />
          </div>
          {/* Decorative circles Skeleton */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16" />
        </div>
      </section>
    </motion.div>
  );
}
