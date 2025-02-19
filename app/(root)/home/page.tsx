// import { PayBlock } from "@/components/Pay";
// import { VerifyBlock } from "@/components/Verify";
import Link from "next/link";
import NavBar from "@/components/TopNavBar";
import { Wallet } from "@/models/Wallet";
import dbConnect from "@/lib/mongodb";

import getRedisClient from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface CryptoData {
  name: string;
  symbol: string;
  price: string;
  change: string;
  icon: string;
  iconBg: string;
}
// Define the User type
type User = {
  name: string;
  balance: number;
  baseCurrency: string;
};

import { CirclePlus, CircleArrowOutUpRight, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import CryptoList from "@/components/CryptoList";
import UserHomePageCard from "@/components/UserHomePage";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log("session from home", session);
  console.log("session", session);

  if (!session) {
    redirect("/");
  }

  const { userId, worldId } = session;

  // there is a twist for the wallet info cache i will add wlt flag so that i can be able to query using the user id

  const redis = await getRedisClient();
  const redisKey = `user:${worldId}`;
  const cachedData = await redis.hGet(redisKey, "walletInfo");

  let user;

  if (!cachedData) {
    await dbConnect();
    user = await Wallet.getWalletByUserId(userId);

    console.log("user data from home", user);
    if (!user?.userId) {
      redirect("/no-user-data");
    }

    if (user) {
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

    console.log("user dashboard", user);
  } else {
    console.info("walletinfo from cache ");
    user = JSON.parse(cachedData);
  }

  // Use the session.user.id to query user-specific data

  // const user = await Wallet.findOne({
  //   userId,
  // }).populate("userId");

  // console.log("user", user);
  // // const user = { name: "John Doe", balance: 100, baseCurrency: "USD" };
  const cryptoData = [
    {
      name: "Worldcoin",
      symbol: "WLD",
      price: "0.02",
      change: "1.34%",
      icon: "WLD",
      iconBg: "bg-gray-800",
    },
    {
      name: "Dollars",
      symbol: "USDC.E",
      price: "3",
      change: "-0.01%",
      icon: "$",
      iconBg: "bg-green-500",
    },
    {
      name: "Ethereum",
      symbol: "WETH",
      price: "0",
      change: "-0.62%",
      icon: "ETH",
      iconBg: "bg-blue-500",
    },
    {
      name: "Bitcoin",
      symbol: "WBTC",
      price: "0",
      change: "+0.37%",
      icon: "₿",
      iconBg: "bg-orange-500",
    },
  ];
  if (!user) {
    redirect("/no-user-data");
  }

  return (
    <div className="flex flex-col  h-[100dvh] bg-white text-black overflow-hidden  px-3 lg:mx-20">
      <NavBar />
      <main className="flex-1 flex flex-col px-1 overflow-auto mt-3">
        <div>
          {/* render user homepage and pass user as props */}
          <UserHomePageCard user={user} />
        </div>

        <div className="flex justify-around items-center mb-auto mt-7 lg:mt-5 px-3">
          <Link href={"/deposit"}>
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-gray-900 text-white w-10 h-10 p-0"
              >
                <CirclePlus className="h-4 w-4" />
              </Button>
              <p className="mt-1 text-xs">Deposit</p>
            </div>
          </Link>
          <Link href={"/withdraw"}>
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-gray-900 text-white w-10 h-10 p-0"
              >
                <CircleArrowOutUpRight className="h-4 w-4" />
              </Button>
              <p className="mt-1 text-xs">Withdraw</p>
            </div>
          </Link>
          <Link href={"/send"}>
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-gray-900 text-white w-10 h-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
              <p className="mt-1 text-xs">Send</p>
            </div>
          </Link>
        </div>

        <div className="flex-1  mt-10  lg:mt-5 p-1 overflow-auto scrollbar-hide  mb-5 lg:px-8">
          <div className="h-full overflow-y-auto scrollbar-hide">
            {cryptoData.map((crypto: CryptoData) => (
              <CryptoList key={crypto.symbol} crypto={crypto} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
