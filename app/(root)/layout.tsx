import { BottomNav } from "@/components/BottomNav";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  return (
    <>
      <main>
        {<BottomNav />}
        {children}
      </main>
    </>
  );
}
