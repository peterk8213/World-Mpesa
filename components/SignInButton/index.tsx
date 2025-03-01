"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
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

export function Spinner({
  size,
  show,
  children,
  className,
}: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show })}>
      <Loader2 className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  );
}

const MotionButton = motion.create(Button);
const handleSignIn = async () => {
  toast.info("Signing in with World ID");
  await signIn("worldcoin");
};

export default function SignInButton() {
  const { data: session, status } = useSession();
  console.log(status);

  return (
    <div>
      <Spinner size="large" show={status == "loading"} />
      <MotionButton
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        disabled={status === "loading"}
        variant={"secondary"}
        onClick={handleSignIn}
        className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                            bg-white/95 hover:bg-white/100
                            text-black  
                           border border-black/10 
                            hover:shadow-md backdrop:blur-md shadow-md"
      >
        <span className="opacity-90 group-hover:opacity-100 transition-opacity">
          Authenticate with World ID
        </span>
        {status === "loading" ? (
          <Spinner size="large" show={true} className="ml-2" />
        ) : (
          <span
            className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                transition-all duration-300"
          >
            →
          </span>
        )}
      </MotionButton>
    </div>
  );
}
