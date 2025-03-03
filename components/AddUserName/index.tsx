"use client";
import { useActionState, useEffect } from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@worldcoin/mini-apps-ui-kit-react/Input";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
import { ArrowRight } from "lucide-react";

import { addUserName } from "@/actions/AddUserName";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
import { ProfileNotification } from "@/components/ProfileNotification";

import { useRouter } from "next/navigation";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-primary"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function AddUserName() {
  const [username, setUsername] = useState({
    name: "",
    isValid: false,
  });
  interface State {
    success?: boolean;
    error?: string;
    pending?: boolean;
  }

  const router = useRouter();

  //  i want to dynamically acesss the changing field and update state

  const [state, formAction, isPending] = useActionState<State>(addUserName, {
    pending: true,
  });

  useEffect(() => {
    if (state?.success) {
      toastSuccess("Username added successfully");
      router.push("/home");
    }
    if (state?.error) {
      toastError(state.error);
      state.error = undefined;
    }
  }, [isPending]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0 opacity-50">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-neutral-200 dark:border-neutral-800"
        >
          <motion.p
            className="text-2xl font-bold mb-6 text-center text-neutral-900 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Add your username
          </motion.p>

          <form action={formAction} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Input
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter username"
                value={username.name}
                onChange={(e) =>
                  setUsername({
                    name: e.target.value,
                    isValid: e.target.value.length > 2,
                  })
                }
                required
              />
            </motion.div>
            <ProfileNotification />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                disabled={!username.isValid || isPending}
                fullWidth
                variant={"primary"}
                radius="md"
                isLoading={isPending}
                className="w-full h-12 text-lg font-medium transition-all duration-300 rounded-md"
              >
                {isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <span className="flex items-center">
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
