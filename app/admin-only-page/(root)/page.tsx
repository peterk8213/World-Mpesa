import type { Metadata } from "next";

import { StatsCards } from "@/components/Admin-Stats-Card";
import { ProfitChart } from "@/components/Admin-Profit-Chart";
import { RecentActivity } from "@/components/Admin-Recent-activity";
import { PaymentMethodsTable } from "@/components/Admin-Payment-Methods";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { subDays } from "date-fns";
import { Suspense } from "react";
import { Wallet } from "@/models/Wallet";
import ManualPayout from "@/models/ManualPayout";
import mongoose from "mongoose";
import { getProfitBreakdown } from "@/lib/admin/profitBreakdown";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing payments and users",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  /// Check if the user is logged in and is an admin
  if (!session?.isAdmin || !session) {
    redirect("/");
  }

  //connect to the database
  await dbConnect();
  return (
    <main className="min-h-screen bg-gray-100 p-4 mt-4">
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight pt-10">Dashboard</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <StatsCardsWrapper />
        </Suspense>
      </div>
    </main>
  );
}

export const StatsCardsWrapper = async () => {
  const [
    totalDeposits,
    totalUsers,
    totalWithdrawals,
    totalWalletBalances,
    totalRevenue,
    totalActualCharges,
    profitBreakdown,
  ] = await Promise.all([
    getTotalDeposits(),
    getUserStats(),
    getTotalWithdrawals(),
    getWalletBalances(),

    getTotalRevenue(),
    getTotalActualCharges(),
    getProfitBreakdown(),
  ]);

  const props = {
    totalDeposits: totalDeposits.total,
    totalUsers,
    totalWithdrawals: totalWithdrawals.total,
    totalWalletBalances,
    totalRevenue: totalRevenue.totalRevenue,
    totalPayout: totalRevenue.totalPayout,
    totalActualCharges,
  };

  return (
    <>
      <StatsCards props={props} />
      <div className="grid gap-6 lg:grid-cols-7">
        <ProfitChart
          className="lg:col-span-4 w-full  "
          data={profitBreakdown}
        />
        <RecentActivity
          className="lg:col-span-3"
          totalDeposits={totalDeposits.count}
          totalWithdrawals={totalWithdrawals.count}
          activeUsers={totalDeposits.activeUsers}
        />
      </div>
      <PaymentMethodsTable />
    </>
  );
};

const getUserStats = async () => {
  const totalUsers = await User.countDocuments();
  return totalUsers;
};

const getTotalDeposits = async () => {
  const result = await Transaction.aggregate([
    {
      $match: {
        type: "credit",
        method: "worldcoin",
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: "$userId" }, // Track unique users
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        count: 1,
        activeUsers: { $size: "$uniqueUsers" }, // Count distinct users
      },
    },
  ]);

  return {
    total: result[0]?.total || 0,
    count: result[0]?.count || 0,
    activeUsers: result[0]?.activeUsers || 0,
  };
};

const getTotalWithdrawals = async () => {
  const result = await Transaction.aggregate([
    {
      $match: {
        type: "debit",
        method: "mpesa",
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return { total: result[0]?.total || 0, count: result[0]?.count || 0 };
};

const getWalletBalances = async () => {
  const result = await Wallet.aggregate([
    { $match: { isFrozen: false } },
    { $group: { _id: null, totalBalance: { $sum: "$balance" } } },
    { $project: { _id: 0, totalBalance: 1 } },
  ]);
  return result[0]?.totalBalance || 0;
};

const getTotalRevenue = async () => {
  const result = await ManualPayout.aggregate([
    { $match: { status: "completed" } }, // Optional: only include successful payouts
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$fees" },
        totalPayout: { $sum: "$amountinKes" },
      },
    },
    { $project: { _id: 0, totalRevenue: 1, totalPayout: 1 } },
  ]);
  return {
    totalRevenue: result[0]?.totalRevenue || 0,
    totalPayout: result[0]?.totalPayout || 0,
  };
};

const getTotalActualCharges = async () => {
  const result = await ManualPayout.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, totalCharges: { $sum: "$actualCharges" } } },
    { $project: { _id: 0, totalCharges: 1 } },
  ]);
  return result[0]?.totalCharges || 0;
};
