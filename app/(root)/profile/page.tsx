// app/profile/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Button } from "@/components/ui/button";

import { VerifyBlock } from "@/components/Verify";
import { Card, CardContent } from "@/components/ui/card";

import ProfileCard from "@/components/ProfileCard";
import PaymenMethods from "@/components/PaymentMethods";
import Link from "next/link";

import { ProfileNotification } from "@/components/ProfileNotification";
import { UsefulLinks } from "@/components/UsefulLinks";
import { redirect } from "next/navigation";

import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";

import { PaymentAccount } from "@/models/PaymentAccount";
import { Suspense } from "react";
import { AichatBotComponent } from "@/components/AichatBotComponent";

const getUserAccountCount = async ({ userId }: { userId: string }) => {
  //// should query a user and return the number of payment accounts

  const paymentAccounts = await PaymentAccount.find({ userId: userId });

  return paymentAccounts.length || 0;
};

const getUserById = async ({
  userId,
}: {
  userId: string;
}): Promise<{
  userName: string;
  verificationLevel: string;
}> => {
  //// should query a user and return the user object
  const user = await User.findOne({ _id: userId }).select(
    "userName  verificationLevel"
  );

  return JSON.parse(JSON.stringify(user));
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const { userId } = session;

  await dbConnect();

  return (
    <div className="flex flex-col min-h-screen   p-2 lg:p-12 lg:mx-20 ">
      <main className="flex-1 flex flex-col px-4 py-6 space-y-6 gap-3">
        <Suspense fallback={<div>Loading...</div>}>
          <ProfilePageWrapper userId={userId} />
        </Suspense>

        <ProfileNotification />
        <AichatBotComponent />
        <UsefulLinks />

        <div className="flex-1" />
      </main>
    </div>
  );
}

const ProfilePageWrapper = async ({ userId }: { userId: string }) => {
  //// delay for 3 seconds

  const [user, PaymentMethodsCount] = await Promise.all([
    getUserById({ userId }),
    getUserAccountCount({ userId }),
  ]);

  return (
    <>
      <div className="">
        <ProfileCard
          userName={user.userName}
          verificationLevel={user.verificationLevel}
        />
      </div>
      <PaymenMethods paymentMethodsCount={PaymentMethodsCount} />
    </>
  );
};
