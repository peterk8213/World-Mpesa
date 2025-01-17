import SplashScreen from "@/components/SplashScreen";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Entry() {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (session) {
    redirect("/home");
  }

  // if (status === "unauthenticated") {
  //   redirect("/");
  // }
  if (!session) {
    return (
      <>
        <main>{<SplashScreen />}</main>
      </>
    );
  }
}
