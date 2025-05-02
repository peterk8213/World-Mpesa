import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dbConnect from "@/lib/mongodb";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import type { ManualPayout as ManualPayoutType } from "@/types";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import ManualPayout from "@/models/ManualPayout";
import { redirect, notFound } from "next/navigation";

const ITEMS_PER_PAGE = 7; // Number of items to display per page

async function getPendingPayouts(
  page: number = 1,
  limit: number = ITEMS_PER_PAGE
): Promise<{ payouts: ManualPayoutType[]; totalCount: number }> {
  const startIndex = (page - 1) * limit;

  try {
    const [payouts, totalCount] = await Promise.all([
      ManualPayout.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .skip(startIndex)

        .limit(limit),
      ManualPayout.countDocuments({ status: "pending" }),
    ]);

    return {
      payouts: JSON.parse(JSON.stringify(payouts)),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching pending payouts:", error);
    return { payouts: [], totalCount: 0 };
  }
}

export default async function PayoutPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  console.log("Session:", session?.isAdmin);
  if (!session) {
    redirect("/");
  }
  if (session.isAdmin == false || session.isAdmin == undefined) {
    notFound();
  }

  await dbConnect();
  const page = (await searchParams).page;

  const currentPage = parseInt(page || "1", 10);
  if (isNaN(currentPage) || currentPage < 1)
    redirect("/admin-only-page/payout?page=1");

  const { payouts: pendingPayouts, totalCount } = await getPendingPayouts(
    currentPage
  );
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4"
        asChild
      >
        <Link href="/admin-only-page">
          <ArrowLeft />
          <span className="sr-only">Back to Home</span>
        </Link>
      </Button>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manual Payouts</CardTitle>
          <CardDescription>
            Review and process pending manual withdrawal requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPayouts.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              No pending payouts found.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead className="text-right">Amount (KES)</TableHead>
                    <TableHead className="text-right">Amount (USD)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayouts.map((payout) => (
                    <TableRow key={payout._id}>
                      <TableCell>{payout.phoneNumber}</TableCell>
                      <TableCell>
                        {payout.ReceiverPartyPublicName || "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {payout.amountinKes.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {payout.amountinUsd.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payout.status === "pending"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(payout.createdAt), "PPp")}
                      </TableCell>
                      <TableCell className="text-right rounded-md">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="bg-black rounded-lg text-white hover:bg-accent/90"
                        >
                          <Link
                            href={`/admin-only-page/payout/complete?transactionId=${payout._id}`}
                          >
                            Payout
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-6">
                <Button asChild disabled={currentPage === 1} variant="outline">
                  <Link
                    href={`/admin-only-page/payout?page=${currentPage - 1}`}
                  >
                    Previous
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  asChild
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  <Link
                    href={`/admin-only-page/payout?page=${currentPage + 1}`}
                  >
                    Next
                  </Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export const dynamic = "force-dynamic";
