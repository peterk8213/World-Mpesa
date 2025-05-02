import type { Metadata } from "next";

import { StatsCards } from "@/components/Admin-Stats-Card";
import { ProfitChart } from "@/components/Admin-Profit-Chart";
import { RecentActivity } from "@/components/Admin-Recent-activity";
import { PaymentMethodsTable } from "@/components/Admin-Payment-Methods";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing payments and users",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) {
    redirect("/");
  }
  return (
    <main className="min-h-screen bg-gray-100 p-4 mt-4">
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight pt-10">Dashboard</h2>
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-7">
          <ProfitChart className="lg:col-span-4 w-full  " />
          <RecentActivity className="lg:col-span-3" />
        </div>
        <PaymentMethodsTable />
      </div>
    </main>
  );
}
