import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import type { ManualPayout as ManualPayoutType } from "@/types"; // Reusing payout type for now
import RefundForm from "@/components/AdminRefundForm"; // Import the new client component
import { processRefundAction } from "@/actions/AdminRefund"; // Import the refund server action
import ManualPayout from "@/models/ManualPayout";
import { redirect } from "next/navigation";

import { Transaction } from "@/models/Transaction";
import dbConnect from "@/lib/mongodb"; // Ensure you have this import for database connection

async function getPayoutForRefund(
  payoutId: string
): Promise<ManualPayoutType | null> {
  console.log(
    "Server-side fetching details for payout ID to refund:",
    payoutId
  );
  //// fetch payout details from the database

  try {
    const response = await ManualPayout.findOne({
      _id: payoutId,
      status: "pending",
    }).populate("transactionId"); // Populate the transactionId field if needed

    return JSON.parse(JSON.stringify(response)); // Convert to plain object
  } catch (error) {
    console.error("Error fetching payout details:", error);
    return null;
  }
}

export default async function RefundPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.isAdmin) {
    redirect("/");
  }

  await dbConnect(); // Ensure the database connection is established

  const payoutId = (await searchParams)?.transactionId;

  let payoutToRefund: ManualPayoutType | null = null;
  let error: string | null = null;

  if (!payoutId) {
    error =
      "Payout ID is missing. Please specify the payout to refund via search parameters (e.g., ?payoutId=...).";
  } else {
    try {
      payoutToRefund = await getPayoutForRefund(payoutId);
      if (!payoutToRefund) {
        error = "Payout details not found for the specified ID.";
      } else if (payoutToRefund.status !== "pending") {
        // Basic check: Only allow refunding 'completed' payouts in this example
        error = `This payout cannot be refunded as its status is '${payoutToRefund.status}'. Only pending payouts are eligible for refunds.`;
        payoutToRefund = null; // Don't pass non-refundable payout to form
      }
    } catch (err) {
      console.error("Server-side fetch error for refund:", err);
      error = "Failed to load payout details for refund. Please try again.";
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-start gap-5 items-center">
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className=" rounded-full"
                  asChild
                >
                  <Link href="/admin-only-page/payout">
                    {" "}
                    {/* Link back to payouts list or relevant admin page */}
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
              </div>
              <div>Process Refund</div>
            </div>
          </CardTitle>
          <CardDescription>
            Initiate a refund for a previously completed payout.
            {payoutId && ` Target Payout ID: ${payoutId}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<RefundFormSkeleton />}>
            {error ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : payoutToRefund ? (
              // Pass fetched data to the client component form
              <RefundForm
                payoutToRefund={payoutToRefund}
                payoutId={payoutId!}
                processRefundAction={processRefundAction} // Pass the server action for processing refunds
                userId={session.userId}
              />
            ) : (
              // This case should ideally be covered by the 'not found' or eligibility errors
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Please provide a valid and eligible Payout ID in the URL to
                  initiate a refund.
                </p>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/payout">View Payouts</Link>
                </Button>
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

function RefundFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton for Details */}
      <div className="space-y-2 border p-4 rounded-md">
        <Skeleton className="h-5 w-1/3 mb-3" /> {/* Title */}
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/5" />
      </div>
      {/* Skeleton for Form */}
      <div className="space-y-6 pt-4 border p-4 rounded-md">
        <Skeleton className="h-5 w-1/4 mb-3" /> {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-20 w-full" /> {/* Textarea */}
        </div>
        <Skeleton className="h-10 w-40" /> {/* Button */}
      </div>
    </div>
  );
}

// Keep dynamic export if data fetching needs to be fresh on every request
export const dynamic = "force-dynamic";
