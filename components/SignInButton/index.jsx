"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignInButton() {
  return (
    <div>
      <Button
        onClick={() => signIn("worldcoin")}
        className="px-6 py-3 text-white text-lg font-semibold rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300"
      >
        Authenticate with World ID
      </Button>
    </div>
  );
}
