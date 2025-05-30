"use client";

import type React from "react";

import {
  Check,
  Receipt,
  ArrowDownToLine,
  ArrowUpFromLine,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Step = {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed?: boolean;
  current?: boolean;
  link?: string;
};

type HorizontalTimelineProps = {
  className?: string;
  progress: {
    title: string;
    completed: boolean;
    current: boolean;
  }[];
};

export function HorizontalTimeline({
  className,
  progress,
}: HorizontalTimelineProps) {
  const steps: Step[] = [
    {
      id: "account",
      title: "Create Account",
      icon: <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      completed: false,
    },
    {
      id: "deposit",
      title: "First Deposit",
      icon: <ArrowDownToLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      link: "/deposit",
      current: false,
    },
    {
      id: "link-payment",
      title: "Link Payment",
      icon: <Receipt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,

      link: "/withdraw/add-account",
      completed: false,
    },
    {
      id: "withdraw",
      title: "First Withdrawal",
      icon: <ArrowUpFromLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      link: "/withdraw",
    },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicators, setShowScrollIndicators] = useState(false);

  // Check if timeline is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        const isScrollable =
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        setShowScrollIndicators(isScrollable);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  // Scroll to current step
  useEffect(() => {
    if (scrollRef.current) {
      const currentStepIndex = steps.findIndex((step) => step.current);
      if (currentStepIndex > -1) {
        const stepElements =
          scrollRef.current.querySelectorAll(".timeline-step");
        if (stepElements[currentStepIndex]) {
          const containerWidth = scrollRef.current.clientWidth;
          const stepWidth = stepElements[currentStepIndex].clientWidth;
          const stepLeft = (stepElements[currentStepIndex] as HTMLElement)
            .offsetLeft;

          // Center the current step
          scrollRef.current.scrollLeft =
            stepLeft - containerWidth / 2 + stepWidth / 2;
        }
      }
    }
  }, [steps]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Left Scroll Indicator */}
      {showScrollIndicators && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex w-6 items-center bg-gradient-to-r from-white to-transparent">
          <div className="h-6 w-6 rounded-full bg-white/80 text-center text-gray-400 shadow-sm">
            ‹
          </div>
        </div>
      )}

      {/* Right Scroll Indicator */}
      {showScrollIndicators && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex w-6 items-center justify-end bg-gradient-to-l from-white to-transparent">
          <div className="h-6 w-6 rounded-full bg-white/80 text-center text-gray-400 shadow-sm">
            ›
          </div>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex w-full overflow-x-auto pb-2 px-4 scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex min-w-max mx-auto">
          {steps.map((step, index) => (
            <Link
              key={index}
              href={step.link ?? "#"}
              className="timeline-step flex flex-col items-center "
            >
              <div className="flex items-center">
                {/* Connector Line (before) */}
                {index > 0 && (
                  <div
                    className={`h-0.5 w-6 sm:w-8 md:w-12 ${
                      steps[index - 1].completed ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Step Icon */}
                <motion.div
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                    step.completed
                      ? "border-black bg-black text-white"
                      : step.current
                      ? "border-black bg-white text-black"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    step.icon
                  )}
                </motion.div>

                {/* Connector Line (after) */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-6 sm:w-8 md:w-12 ${
                      step.completed ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Step Title */}
              <div className="mt-2 w-16 sm:w-20 md:w-24 text-center">
                <p
                  className={`text-[10px] sm:text-xs md:text-sm ${
                    step.completed || step.current
                      ? "font-medium text-black"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
