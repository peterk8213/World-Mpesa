// app/profile/page.tsx

import { ArrowLeft, HelpCircle, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { VerifyBlock } from "@/components/Verify";
import { Card, CardContent } from "@/components/ui/card";
import ProfileNavBar from "@/components/ProfileNavBar";
import ProfileCard from "@/components/ProfileCard";
import MpesaPaymentForm from "@/components/PaymentMethods";
import Link from "next/link";

// Define the User type
type User = {
  name: string;
  balance: number;
  baseCurrency: string;
};

export default function ProfilePage() {
  // const { data: session } = useSession();
  // const user = session?.user;
  // const [isVerified, setIsVerified] = useState(false);

  // if (!user) {
  //   router.push("/");
  // }

  const user: User = {
    name: "John Doe",
    balance: 5000.75,
    baseCurrency: "KES",
  };

  return (
    <div className="flex flex-col min-h-screen   p-2 lg:p-12 lg:mx-20 animate-fade-in">
      <main className="flex-1 flex flex-col px-4 py-6 space-y-6">
        <div>
          <ProfileNavBar />
        </div>
        <div className="">
          <ProfileCard user={user} />
        </div>
        <MpesaPaymentForm
          initialPaymentMethods={[
            {
              id: "string1",
              fullName: "kennedy kanini",
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
        <Card className="bg-white bg-opacity-10  border-none ">
          <CardContent className="p-6 space-y-4">
            <Link href={`/settings/${user?.name}`}>
              <Button
                variant="ghost"
                className="w-full justify-between py-2  hover:bg-white hover:bg-opacity-20"
              >
                <span>Settings</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/help/${user?.name}`}>
              <Button
                variant="ghost"
                className="w-full justify-between py-2  hover:bg-white hover:bg-opacity-20"
              >
                <span>Help & Support</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="flex-1" />
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
