import { ArrowLeft } from "lucide-react";
import { WithdrawHeader } from "@/components/WithdrawHeader";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <div>
        {<WithdrawHeader title="Withdraw" />}
        {children}
      </div>
    </>
  );
}
