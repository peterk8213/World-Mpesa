// import { PayBlock } from "@/components/Pay";
// import { VerifyBlock } from "@/components/Verify";
import Link from "next/link";
import { Wallet } from "@/models/Wallet";
import dbConnect from "@/lib/mongodb";

import getRedisClient from "@/lib/redis";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { AppServices } from "@/components/Services";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Bot } from "lucide-react";

// Define the User type
type User = {
  name: string;
  balance: number;
  baseCurrency: string;
};

import { Button } from "@/components/ui/button";

import UserHomePageCard from "@/components/UserHomePage";
import { HomePageAnalytics } from "@/components/HomepageAnalytics";
import { Suspense } from "react";

const getUser = async (session: Session) => {
  const { userId, worldId } = session;

  // there is a twist for the wallet info cache i will add wlt flag so that i can be able to query using the user id

  const redis = await getRedisClient();
  const redisKey = `user:${worldId}`;
  const cachedData = await redis.hGet(redisKey, "walletInfo");

  let user;

  if (cachedData) {
    console.info("walletinfo from cache ");
    user = JSON.parse(cachedData);
    console.log("user from cache");
  }

  if (!cachedData) {
    user = await Wallet.getWalletByUserId(userId);

    console.log("user data from home", user);
    if (!user) {
      redirect("/no-user-data");
    }

    // Store data in cache with a TTL (e.g., 3600 seconds)

    const walletInfo = {
      _id: user._id,
      userId: {
        _id: user.userId._id,
        name: user.userId.name,
      },
      worldId: user.worldId,
      balance: user.balance,
      currency: user.currency,
    };
    await redis
      .multi()
      .hSet(redisKey, "walletInfo", JSON.stringify(walletInfo))
      // Set TTL for the entire key (in seconds)
      // Expires after 10 hours
      .expire(redisKey, 60)
      .exec();
  }

  return user;
};

const getUserWallet = async ({ userId }: { userId: string }) => {
  const user = await Wallet.getWalletByUserId(userId);
  const {
    userId: { userName },

    balance,
    currency,
  } = user;

  return {
    userName,
    balance,
    currency,
  };
};

const getUserAnalytics = async ({
  userId,
  timeframe,
}: {
  userId: string;
  timeframe: string;
}) => {
  const sampleData = {
    daily: [
      { name: "12AM", amount: 2 },
      { name: "4AM", amount: 1398 },
      { name: "8AM", amount: 9 },
      { name: "12PM", amount: 3908 },
      { name: "4PM", amount: 4800 },
      { name: "8PM", amount: 3800 },
      { name: "11PM", amount: 4 },
    ],
    weekly: [
      { name: "Mon", amount: 4000 },
      { name: "Tue", amount: 3000 },
      { name: "Wed", amount: 6000 },
      { name: "Thu", amount: 4000 },
      { name: "Fri", amount: 5000 },
      { name: "Sat", amount: 4500 },
      { name: "Sun", amount: 4800 },
    ],
    monthly: [
      { name: "Jan", amount: 12000 },
      { name: "Feb", amount: 13500 },
      { name: "Mar", amount: 11800 },
      { name: "Apr", amount: 14200 },
      { name: "May", amount: 15000 },
      { name: "Jun", amount: 13800 },
    ],
  };

  return sampleData[timeframe] || [];
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ timeframe?: string }>;
}) {
  const session = await getServerSession(authOptions);

  const { userId } = session;

  if (!session) {
    redirect("/authentication");
  }
  await dbConnect();

  const timeframe = (await searchParams).timeframe || "weekly"; // Default to "weekly"
  const validTimeframes = ["daily", "weekly", "monthly"];

  if (!validTimeframes.includes(timeframe)) {
    notFound(); // Handle invalid timeframe values
  }

  return (
    <div className="flex flex-col  bg-white text-black overflow-auto  lg:mx-20 gap-[3rem] pb-4 ">
      <div className="flex flex-col lg:flex-row lg:space-x-4 px-2 ">
        {/* render user homepage and pass user as props */}
        <Suspense fallback={<div>Loading...</div>}>
          <HomePageWrapper userId={userId} />
        </Suspense>
      </div>

      <div className="px-2">
        <AppServices />
      </div>
      {/* <div className="flex flex-col lg:flex-row lg:space-x-4 px-2 ">
        <Suspense fallback={<div>Loading...</div>} key={timeframe}>
          <HomePageAnalyticsWrapper userId={userId} timeframe={timeframe} />
        </Suspense>
      </div> */}
      <div></div>
    </div>
  );
}

const HomePageWrapper = async ({ userId }: { userId: string }) => {
  //// delay for 3 seconds

  const user = await getUserWallet({ userId });

  if (!user) {
    redirect("/no-user-data");
  }

  return (
    <>
      <div className="">
        <UserHomePageCard user={user} />
      </div>
    </>
  );
};

const HomePageAnalyticsWrapper = async ({
  userId,
  timeframe,
}: {
  userId: string;
  timeframe: string;
}) => {
  const data: {
    name: string;
    amount: number;
  }[] = await getUserAnalytics({ userId, timeframe });
  ///// delay for 3 seconds

  return (
    <>
      <div className="">
        <HomePageAnalytics data={data} />
      </div>
    </>
  );
};
