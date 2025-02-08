// changed the layout
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Header } from "@/components/DepositHeader";
import { ArrowLeft } from "lucide-react";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Header
        leftIcon={<ArrowLeft className="h-6 w-6" />}
        showLogo={false}
        title="Checkout"
      />
      <main>{children}</main>
    </>
  );
}
