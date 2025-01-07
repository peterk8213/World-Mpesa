// app/profile/page.tsx

"use client";

import { useState } from "react";
import { ArrowLeft, LogOut, HelpCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { signOut, useSession } from "next-auth/react";
import { VerifyBlock } from "@/components/Verify";
import { Card, CardContent } from "@/components/ui/card";
import ProfileNavBar from "@/components/ProfileNavBar";
import ProfileCard from "@/components/ProfileCard";
import MpesaPaymentForm from "@/components/PaymentMethods";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [isVerified, setIsVerified] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) {
    router.push("/");
  }

  return (
    <div className="flex flex-col min-h-screen   p-2 lg:p-8  bg-gradient-to-br from-blue-100 to-gray-100">
      <ProfileNavBar />
      <div className="">
        <ProfileCard user={user} />
      </div>
      <MpesaPaymentForm
        initialPaymentMethods={[
          {
            id: "string",
            fullName: "M-pesa",
            phoneNumber: "0757608513",
            isDefault: true,
          },
          {
            id: "string",
            fullName: "M-pesa",
            phoneNumber: "0769807821",
            isDefault: false,
          },
        ]}
      />

      <main className="flex-1 flex flex-col px-4 py-6 space-y-6">
        <Card className="bg-white bg-opacity-10 backdrop-blur-md border-none ">
          <CardContent className="p-6 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-between py-2  hover:bg-white hover:bg-opacity-20"
              onClick={() => router.push("/settings")}
            >
              <span>Settings</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-between py-2  hover:bg-white hover:bg-opacity-20"
              onClick={() => router.push("/help")}
            >
              <span>Help & Support</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex-1" />

        <Button
          variant="destructive"
          className="w-full py-3 bg-red-500 hover:bg-red-600 mb-7"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </main>
    </div>
  );
}

// import { PayBlock } from "@/components/Pay";
// import { VerifyBlock } from "@/components/Verify";
// import { Button } from "@/components/ui/button";
// import { signIn, signOut, useSession } from "next-auth/react";

// export default function Profile() {
//   return (
//     <main className="flex flex-col items-center justify-center p-4">
//       <h1 className="text-2xl font-bold">Profile</h1>
//       <VerifyBlock />
//       {/* Content for the user profile */}
//     </main>
//   );
// }

// // <Button onClick={() => signOut()} className="w-full">
// //   <p>sign out</p>
// // </Button>
