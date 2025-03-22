"use client";

import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Step = {
  id: string;
  title: string;
  icon: LucideIcon;
  completed?: boolean;
  current?: boolean;
  link?: string;
};

type HorizontalTimelineProps = {
  steps: Step[];
  className?: string;
};

export function HorizontalTimeline({
  steps,
  className,
}: HorizontalTimelineProps) {
  return (
    <div className={cn("max-w-4xl pb-2 px-4", className)}>
      <div className="flex ">
        {steps.map((step, index) => (
          <Link key={index} href={step.link ?? "#"}>
            <div key={step.id} className="flex flex-col items-center">
              {/* Step and Line Container */}
              <div className="flex items-center">
                {/* Connector Line (before) */}
                {index > 0 && (
                  <div
                    className={`h-0.5 w-12 ${
                      steps[index - 1].completed ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Step Icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    step.completed
                      ? "border-black bg-black text-white"
                      : step.current
                      ? "border-black bg-white text-black"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>

                {/* Connector Line (after) */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 ${
                      step.completed ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Step Title */}
              <div className="mt-2 w-20 text-center">
                <p
                  className={`text-xs ${
                    step.completed || step.current
                      ? "font-medium text-black"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
