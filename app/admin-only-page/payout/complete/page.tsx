import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { ManualPayout as ManualPayoutType } from "@/types";
import ManualPayout from "@/models/ManualPayout"; // Adjust the import path as necessary
import CompletePayoutForm from "@/components/AdminPayoutForm"; // Import the new client component

async function getPayoutDetails(
  payoutId: string
): Promise<ManualPayoutType | null> {
  console.log("Server-side fetching details for payout ID:", payoutId);

  const response = await ManualPayout.findOne({
    _id: payoutId,
    status: "pending",
  });
  if (!response) {
    console.error("No payout found with the given ID:", payoutId);
    return null;
  }
  console.log("Fetched payout details:", response);
  return JSON.parse(JSON.stringify(response)); // Convert to plain object
}
// --- End Mock Data Fetching ---

interface CompletePayoutPageProps {
  searchParams?: {
    payoutId?: string;
  };
}

// This is now a Server Component
export default async function CompletePayoutPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  const payoutId = (await searchParams).transactionId;
  let payoutDetails: ManualPayoutType | null = null;
  let error: string | null = null;

  if (!payoutId) {
    error = "Payout ID is missing from the URL.";
  } else {
    try {
      payoutDetails = await getPayoutDetails(payoutId);
      if (!payoutDetails) {
        error = "Payout details not found.";
      }
      // Note: Checking status logic moved to client component for disabling form
    } catch (err) {
      console.error("Server-side fetch error:", err);
      error = "Failed to load payout details. Please try again.";
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4"
        asChild
      >
        <Link href="/admin-only-page/payout">
          <ArrowLeft />
          <span className="sr-only">Back to Payouts</span>
        </Link>
      </Button>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Manual Payout</CardTitle>
          <CardDescription>
            {`Processing payout ID: ${payoutId || "N/A"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PayoutDetailsSkeleton />}>
            {error ? (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : payoutDetails ? (
              // Pass fetched data to the client component
              <CompletePayoutForm
                payoutDetails={payoutDetails}
                payoutId={payoutId!}
              />
            ) : (
              // This case should ideally be covered by the 'not found' error
              <p className="text-muted-foreground text-center py-10">
                No payout details available.
              </p>
            )}
          </Suspense>
        </CardContent>
        {payoutDetails && payoutDetails.status !== "pending" && (
          <CardFooter>
            <p className="text-sm text-destructive">
              This payout cannot be modified as it is not in 'pending' status.
            </p>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}

function PayoutDetailsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Skeleton for Details */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/5" />
      </div>
      {/* Skeleton for Form */}
      <div className="space-y-6 pt-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" /> {/* Label */}
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-24" /> {/* Radio */}
            <Skeleton className="h-8 w-24" /> {/* Radio */}
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
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
