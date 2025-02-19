"use client";

import { signOut } from "next-auth/react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";

import { AlertCircle, LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <div className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white">
      <Button
        onClick={() => signOut()}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        Sign Out
      </Button>
    </div>
  );
}
