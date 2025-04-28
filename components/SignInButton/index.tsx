"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

function Spinner({ size, show, className, children }: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      <Loader2 className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  );
}

const MotionButton = motion(Button);

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      toast.info("Signing in with World ID...");
      await signIn("worldcoin"); // No redirect handling needed here if configured.
    } catch (error) {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <MotionButton
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        disabled={isLoading}
        variant="secondary"
        onClick={handleSignIn}
        className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
          bg-white/95 hover:bg-white/100
          text-black border border-black/10 
          hover:shadow-md backdrop:blur-md shadow-md flex items-center"
      >
        {isLoading ? (
          <Spinner size="small" show={true} className="mr-2" />
        ) : (
          <span className="opacity-90 group-hover:opacity-100 transition-opacity">
            Authenticate with World ID
          </span>
        )}
        {!isLoading && (
          <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
            →
          </span>
        )}
      </MotionButton>
    </div>
  );
}
