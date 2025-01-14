"use client";
import SplashScreen from "@/components/SplashScreen";
import { useSession } from "next-auth/react";

import Home from "./home/page";
export default function Entry() {
  const { data: session, status } = useSession();

  return (
    <>
      <main>{session ? <Home /> : <SplashScreen />}</main>
    </>
  );
}
