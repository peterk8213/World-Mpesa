import Link from "next/link";

import { Wallet } from "@/models/Wallet";
import UserHomePageCardSkeleton from "@/components/UserHomePageCardSkeleton";

import dbConnect from "@/lib/mongodb";

import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { AppServices } from "@/components/Services";

import PendingWithdrawals from "@/components/PendingWithdrawals";
import ManualPayout from "@/models/ManualPayout";

import UserHomePageCard from "@/components/UserHomePage";
//import { HomePageAnalytics } from "@/components/HomepageAnalytics";
import { Suspense } from "react";
import { RatingDialog } from "@/components/RatingDrawer";

//impor { HorizontalTimeline } from "@/components/HorizontalTimeline";

// Define the User type
type User = {
  name: string;
  balance: number;
  baseCurrency: string;
};

const getUserWallet = async ({ userId }: { userId: string }) => {
  const user = await Wallet.getWalletByUserId(userId);
  if (!user) {
    redirect("/no-user-data");
  }
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

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const { userId } = session;

  await dbConnect();

  return (
    <div className="flex flex-col bg-white text-black overflow-auto lg:mx-20 gap-[3rem] pb-10">
      <div className="flex flex-col lg:flex-row lg:space-x-4 px-2">
        <Suspense
          fallback={
            <div>
              <UserHomePageCardSkeleton />
            </div>
          }
        >
          <HomePageWrapper userId={userId} />
        </Suspense>
      </div>
      {/* <div className="px-2">
        <div> having trouble withdrawing funds??</div>

        <a href="https://forms.gle/ipXM6GerssTCFv859">
          <div className="text-underline"> submit your issue here??</div>{" "}
        </a>
      </div> */}

      <div className="px-2">
        <AppServices />
      </div>
      <div className="px-2">
        <RatingDialog />
      </div>
    </div>
  );
}

//pass the balance as props to the user homepage card

const HomePageWrapper = async ({ userId }: { userId: string }) => {
  const user = await getUserWallet({ userId });

  if (!user) {
    redirect("/no-user-data");
  }

  return (
    <div>
      <div className=" flex flex-col lg:flex-row lg:space-x-4 px-2 gap-4">
        <UserHomePageCard user={user} />
      </div>
      <div className="px-2 w-full flex justify-start items-center pt-6">
        <Suspense fallback={<div></div>}>
          {await getPendingWithdrawalsCountWrapper({
            userId,
            balance: user.balance,
          })}
        </Suspense>
      </div>
    </div>
  );
};

export const getPendingWithdrawalsCountWrapper = async (
  { userId, balance }: { userId: string; balance?: number } // Optional balance prop
) => {
  const getPendingWithdrawals = async (userId: string) => {
    try {
      const pendingWithdrawals = await ManualPayout.find({
        userId: userId,
        status: "pending",
      });
      return pendingWithdrawals.length;
    } catch (error) {
      console.error("Error fetching pending withdrawals:", error);
      return;
    }
  };

  const pendingWithdrawals = await getPendingWithdrawals(userId);

  return pendingWithdrawals && pendingWithdrawals > 0 ? (
    <div className="">
      <PendingWithdrawals count={pendingWithdrawals} balance={balance} />
    </div>
  ) : null;
};

// // import { PayBlock } from "@/components/Pay";
// // import { VerifyBlock } from "@/components/Verify";
// import Link from "next/link";
// import { WorldcoinTransaction } from "@/models/WldTransaction";
// import { Wallet } from "@/models/Wallet";
// import { PaymentAccount } from "@/models/PaymentAccount";

// import MpesaPayment from "@/models/MpesaPayment";
// import dbConnect from "@/lib/mongodb";

// import getRedisClient from "@/lib/redis";
// import { getServerSession, Session } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { notFound, redirect } from "next/navigation";
// import { AppServices } from "@/components/Services";

// // Define the User type
// type User = {
//   name: string;
//   balance: number;
//   baseCurrency: string;
// };

// import UserHomePageCard from "@/components/UserHomePage";
// import { HomePageAnalytics } from "@/components/HomepageAnalytics";
// import { Suspense } from "react";
// import { HorizontalTimeline } from "@/components/HorizontalTimeline";

// const getUser = async (session: Session) => {
//   const { userId, worldId } = session;

//   // there is a twist for the wallet info cache i will add wlt flag so that i can be able to query using the user id

//   const redis = await getRedisClient();
//   const redisKey = `user:${worldId}`;
//   const cachedData = await redis.hGet(redisKey, "walletInfo");

//   let user;

//   if (cachedData) {
//     console.info("walletinfo from cache ");
//     user = JSON.parse(cachedData);
//     console.log("user from cache");
//   }

//   if (!cachedData) {
//     user = await Wallet.getWalletByUserId(userId);

//     console.log("user data from home", user);
//     if (!user) {
//       redirect("/no-user-data");
//     }

//     // Store data in cache with a TTL (e.g., 3600 seconds)

//     const walletInfo = {
//       _id: user._id,
//       userId: {
//         _id: user.userId._id,
//         name: user.userId.name,
//       },
//       worldId: user.worldId,
//       balance: user.balance,
//       currency: user.currency,
//     };
//     await redis
//       .multi()
//       .hSet(redisKey, "walletInfo", JSON.stringify(walletInfo))
//       // Set TTL for the entire key (in seconds)
//       // Expires after 10 hours
//       .expire(redisKey, 60)
//       .exec();
//   }

//   return user;
// };

// const getUserWallet = async ({ userId }: { userId: string }) => {
//   const user = await Wallet.getWalletByUserId(userId);
//   if (!user) {
//     redirect("/no-user-data");
//   }
//   const {
//     userId: { userName },

//     balance,
//     currency,
//   } = user;

//   return {
//     userName,
//     balance,
//     currency,
//   };
// };

// // const getTimelineData = async ({ userId }: { userId: string }) => {
// //   /// resolve in parallel
// //   const [linkedAccounts, deposits, withdrawals] = await Promise.all([
// //     PaymentAccount.find({ userId: userId }),
// //     WorldcoinTransaction.find({ userId: userId }),
// //     MpesaPayment.find({ userId: userId }),
// //   ])
// //     .then((data) => {
// //       return data;
// //     })
// //     .catch((err) => {
// //       console.log("error fetching timeline data", err);
// //       return [[], [], []];
// //     });
// // };

// // const getUserAnalytics = async ({
// //   userId,
// //   timeframe,
// // }: {
// //   userId: string;
// //   timeframe: string;
// // }) => {
// //   const data = await Wallet.getWalletAnalytics(userId, timeframe);

// //   return data;
// // };

// export default async function Home() {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     redirect("/authentication");
//   }

//   const { userId } = session;

//   await dbConnect();

//   return (
//     <div className="flex flex-col  bg-white text-black overflow-auto  lg:mx-20 gap-[3rem] pb-8">
//       <div className="flex flex-col lg:flex-row lg:space-x-4 px-2 ">
//         {/* render user homepage and pass user as props */}
//         <Suspense fallback={<div>Loading...</div>}>
//           <HomePageWrapper userId={userId} />
//         </Suspense>
//       </div>

//       {/* <div className="px-2 ">
//         <Suspense fallback={<div>Loading...</div>}>
//           <HoricontalTimelineWrapper userId={userId} />
//         </Suspense>
//       </div> */}

//       <div className="px-2">
//         <AppServices />
//       </div>
//       {/* <div className="flex flex-col lg:flex-row lg:space-x-4 px-2 ">
//         <Suspense fallback={<div>Loading...</div>} key={timeframe}>
//           <HomePageAnalyticsWrapper userId={userId} timeframe={timeframe} />
//         </Suspense>
//       </div> */}
//       <div></div>
//     </div>
//   );
// }

// const HomePageWrapper = async ({ userId }: { userId: string }) => {
//   //// delay for 3 seconds

//   const user = await getUserWallet({ userId });

//   if (!user) {
//     redirect("/no-user-data");
//   }

//   return (
//     <>
//       <div className="">
//         <UserHomePageCard user={user} />
//       </div>
//     </>
//   );
// };

// // const HoricontalTimelineWrapper = async ({ userId }: { userId: string }) => {
// //   const user = await getUserWallet({ userId });
// //   if (!user) {
// //     redirect("/no-user-data");
// //   }
// //   const { userName, balance, currency } = user;

// //   return (
// //     <>
// //       <div className="">
// //         <HorizontalTimeline />
// //       </div>
// //     </>
// //   );
// // };

// // const HomePageAnalyticsWrapper = async ({
// //   userId,
// //   timeframe,
// // }: {
// //   userId: string;
// //   timeframe: string;
// // }) => {
// //   const data: {
// //     name: string;
// //     amount: number;
// //   }[] = await getUserAnalytics({ userId, timeframe });
// //   ///// delay for 3 seconds

// //   return (
// //     <>
// //       <div className="">
// //         <HomePageAnalytics data={data} />
// //       </div>
// //     </>
// //   );
// // };
