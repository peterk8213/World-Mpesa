import { Rubik } from "next/font/google";
import type { Metadata } from "next";
import { ToastContainer, Bounce } from "react-toastify";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";

import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import { ErudaClient } from "@/components/Eruda/ErudaClient";

import { PostHogProvider } from "@/components/posthog-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MpesaWorld",
  description: "A Mpesa wallet for the World ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <SpeedInsights />

        <NextAuthProvider>
          <PostHogProvider>
            <ErudaClient>
              <MiniKitProvider>
                {/* Main content area */}
                <main className="min-h-screen overflow-hidden overscroll-none">
                  <div className="px-6">
                    <ToastContainer
                      position="top-center"
                      autoClose={2000}
                      hideProgressBar
                      newestOnTop
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                      transition={Bounce}
                    />
                  </div>
                  {children}
                </main>
              </MiniKitProvider>
            </ErudaClient>
          </PostHogProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
