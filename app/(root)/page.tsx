import SplashScreen from "@/components/SplashScreen";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Entry() {
  const session = await getServerSession(authOptions);

  // if (session?.isnewUser) {
  //   redirect("/add-username");
  // }

  // if (status === "unauthenticated") {
  //   redirect("/");
  // }
  if (!session || session == null) {
    return (
      <>
        <main>{<SplashScreen />}</main>
      </>
    );
  }
  if (session) {
    redirect("/home");
  }
}
