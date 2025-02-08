import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/DepositHeader";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Header leftIcon={<ArrowLeft className="h-6 w-6" />} />
      <main className="">{children}</main>
    </>
  );
}
