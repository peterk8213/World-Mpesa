import { ArrowLeft } from "lucide-react";
import { SendMoneyHeader } from "@/components/SendMoneyPageHeader";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <SendMoneyHeader />
      <main className="mt-10">{children}</main>
    </>
  );
}
