import { Rubik } from "next/font/google";
import type { Metadata } from "next";
import { ToastContainer, Bounce } from "react-toastify";

import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import { ErudaClient } from "@/components/Eruda/ErudaClient";

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
        <NextAuthProvider>
          <ErudaClient>
            <MiniKitProvider>
              {/* Main content area */}
              <main className="min-h-screen ">
                <ToastContainer
                  position="top-center"
                  autoClose={4000}
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
                {children}
              </main>
            </MiniKitProvider>
          </ErudaClient>
        </NextAuthProvider>
      </body>
    </html>
  );
}
