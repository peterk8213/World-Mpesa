"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install();
    console.log(MiniKit.isInstalled());
    const username = MiniKit?.user;
    console.log("user from minikit", username);
  }, []);

  return <>{children}</>;
}
