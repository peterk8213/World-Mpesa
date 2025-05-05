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
import { RefreshButton } from "@/components/RefreshButton";

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
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import ManualPayout from "@/models/ManualPayout";
import { redirect, notFound } from "next/navigation";

const ITEMS_PER_PAGE = 10; // Number of items to display per page

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
    <main className="flex min-h-screen flex-col items-center p-6">
      <Card className="w-full max-w-4xl pt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <div className="flex justify-between items-center">
              <div>
                <div>Manual Payouts</div>
              </div>
              <div>
                <RefreshButton />
              </div>
            </div>
          </CardTitle>

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
                          className="text-center rounded-xl bg-orange-100"
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
                        {/* // i need it in locale format in the time zone of the
                        user use to locale string  */}
                        {new Date(payout.createdAt).toLocaleString("en-US", {
                          timeZone: "Africa/Nairobi",
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </TableCell>
                      <TableCell className="text-right rounded-lg">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="bg-accent rounded-lg text-black "
                        >
                          <Link
                            href={`/admin-only-page/payout/refund?transactionId=${payout._id}`}
                          >
                            Refund
                          </Link>
                        </Button>
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
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 left-4"
              >
                <Link href="/admin-only-page">
                  <ArrowLeft />
                  <span className="sr-only">Back to Home</span>
                </Link>
              </Button>

              <div className="flex justify-between items-center mt-6">
                <Button asChild disabled={currentPage === 1} variant="link">
                  <Link
                    href={`/admin-only-page/payout?page=${currentPage - 1}`}
                  >
                    <div className="flex items-center text-sm text-muted-foreground hover:text-black">
                      <ChevronLeft className="ml-2" />
                      <div>Previous</div>
                    </div>
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  asChild
                  disabled={currentPage === totalPages}
                  variant="link"
                >
                  <Link
                    href={`/admin-only-page/payout?page=${currentPage + 1}`}
                  >
                    <div className="flex items-center text-sm text-muted-foreground hover:text-black">
                      <div>Next</div>
                      <ChevronLeft className="rotate-180 ml-2" />
                    </div>
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
