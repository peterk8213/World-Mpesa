"use client";

import type React from "react";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { useSession } from "next-auth/react"; // Assuming you're using next-auth for session management
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, Coins, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import type { ManualPayout, CompletePayoutInput } from "@/types";
import { completeManualPayoutAction } from "@/actions/Payout"; // Import the server action
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";

// Interface for the form data
interface PayoutFormValues {
  status: "completed" | "failed" | undefined;
  confirmationCode?: string;
  notes?: string;
  actualCharges?: number;
}

interface State {
  success?: boolean;
  error?: string;
  pending?: boolean;
}
interface PreviousDeposit {
  _id: string;
  createdAt: Date;
  inputTokenAmount?: number;
  inputToken?: string;
  transactionStatus?: string;
  transactionHash?: string;
}

interface CompletePayoutFormProps {
  payoutDetails: ManualPayout;
  payoutId: string;
  deposits: PreviousDeposit[];
}

const formatTokenAmount = ({
  inputTokenAmount,
  inputToken,
}: {
  inputTokenAmount?: number;
  inputToken?: string;
}) => {
  console.log("amount", inputTokenAmount, "inputToken", inputToken);
  const decimals = inputToken === "WLD" ? 18 : inputToken === "USDCE" ? 6 : 0;
  if (decimals === 0) return 0;

  const Formattedamount = Number(inputTokenAmount) / Math.pow(10, decimals);
  return Formattedamount;
};

const CompletePayoutForm: React.FC<CompletePayoutFormProps> = ({
  payoutDetails,
  payoutId,
  deposits,
}) => {
  const router = useRouter();
  const { data: session } = useSession(); // Assuming you have a session hook to get the current user session
  if (!session) {
    router.push("/"); // Redirect to login if session is not available
    return null; // Prevent rendering if session is not available
  }
  const { userId } = session; // Assuming user ID is available in the session

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isAlreadyProcessed = payoutDetails.status !== "pending";

  const form = useForm<PayoutFormValues>({
    // Pre-fill form based on passed details, but keep status undefined initially if pending
    defaultValues: {
      status:
        isAlreadyProcessed && payoutDetails.status !== "pending"
          ? payoutDetails.status
          : undefined,
      confirmationCode: payoutDetails.confirmationCode || "",
      notes: payoutDetails.notes || "",
      actualCharges: payoutDetails.actualCharges,
    },
  });
  const [state, formAction, Pending] = useActionState<State>(
    completeManualPayoutAction,
    {
      pending: false,
    }
  );

  useEffect(() => {
    if (state?.success) {
      toastInfo("Payment account added successfully");

      if (state?.error) {
        toastError(state.error);
        state.error = undefined;
      }
    }
  }, [state, Pending]);

  const onSubmit = (values: PayoutFormValues) => {
    if (isAlreadyProcessed) return; // Prevent submission if already processed

    // Basic manual check: Ensure status is selected
    if (!values.status) {
      form.setError("status", {
        type: "manual",
        message: "You must select a status.",
      });
      return; // Stop submission if status is not selected
    }
    form.clearErrors("status"); // Clear error if status is now selected

    setFormError(null);
    setFormSuccess(null);

    startTransition(async () => {
      // **TODO**: Replace "admin-placeholder-id" with actual admin ID from session/context

      const input: CompletePayoutInput = {
        payoutId,
        adminId: userId,
        status: values.status!, // Status is guaranteed non-null here
        confirmationCode: values.confirmationCode || undefined,
        notes: values.notes || undefined,
        // Coerce actualCharges to number or undefined
        actualCharges:
          values.actualCharges !== undefined &&
          values.actualCharges !== null &&
          !isNaN(Number(values.actualCharges))
            ? Number(values.actualCharges)
            : undefined,
      };

      // Optional validation
      if (input.actualCharges !== undefined && input.actualCharges < 0) {
        form.setError("actualCharges", {
          type: "manual",
          message: "Charges cannot be negative.",
        });
        return;
      }

      const result = await completeManualPayoutAction(input);

      if (!result.success) {
        setFormError(result.message || "An unknown error occurred.");
        toastError(result.message || "An unknown error occurred.");
      } else {
        setFormSuccess(result.message);
        form.reset(); // Reset form on success
        toastSuccess(result.message || "Payout status updated successfully.");
        // Optionally redirect after a short delay
        router.push("/admin-only-page/payout"); // Redirect to a different page after successful submission
      }
    });
  };

  const isFormDisabled = isPending || isAlreadyProcessed;
  console.log("previous deposits", deposits);

  return (
    <div className="space-y-6">
      {/* Display Payout Details (Read-Only) */}
      <div>
        <h3 className="font-semibold mb-2">Payout Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>Phone Number:</span>
          <span className="font-medium text-foreground">
            {payoutDetails.phoneNumber}
          </span>
          <span>Recipient Name:</span>
          <span className="font-medium text-foreground">
            {payoutDetails.ReceiverPartyPublicName || "N/A"}
          </span>
          <span>Amount (KES):</span>
          <span className="font-medium text-foreground">
            {payoutDetails.amountinKes.toFixed(2)}
          </span>
          <span>Amount (USD):</span>
          <span className="font-medium text-foreground">
            {payoutDetails.amountinUsd.toFixed(2)}
          </span>

          <span className="text-muted-foreground">Current Status:</span>
          <span className="font-medium text-foreground">
            {payoutDetails.status}
          </span>

          <span>Fees:</span>
          <span className="font-medium text-foreground">
            {payoutDetails.fees?.toFixed(2) || "0.00"}
          </span>
        </div>
      </div>

      {/* Recent Deposits Section */}
      <div>
        <h3 className="font-semibold mb-2 text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> User Deposit History
          (Last 5)
        </h3>
        {!deposits ? (
          <div className="border p-4 rounded-md bg-card text-center">
            <Coins className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">
              No recent deposit history found for this user.
            </p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Txn Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => (
                  <TableRow key={deposit._id}>
                    <TableCell className="text-xs">
                      {deposit.createdAt
                        ? format(new Date(deposit.createdAt), "PPp")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatTokenAmount({
                        inputTokenAmount: deposit.inputTokenAmount,
                        inputToken: deposit.inputToken,
                      }) ?? "N/A"}
                    </TableCell>
                    <TableCell>{deposit.inputToken ?? "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          deposit.transactionStatus === "completed"
                            ? "default"
                            : deposit.transactionStatus === "submitted"
                            ? "secondary"
                            : deposit.transactionStatus === "failed"
                            ? "destructive"
                            : "outline"
                        }
                        className="capitalize text-xs"
                      >
                        {deposit.transactionStatus ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono truncate max-w-[100px]">
                      {deposit.transactionHash ? (
                        <a
                          href={`https://optimistic.etherscan.io/tx/${deposit.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {deposit.transactionHash.substring(0, 6)}...
                          {deposit.transactionHash.substring(
                            deposit.transactionHash.length - 4
                          )}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Payout Completion Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          action={formAction}
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Mark as *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) =>
                      field.onChange(value as "completed" | "failed")
                    }
                    defaultValue={field.value ?? ""}
                    className="flex flex-col space-y-1"
                    disabled={isFormDisabled}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="completed" />
                      </FormControl>
                      <FormLabel className="font-normal">Completed</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="failed" />
                      </FormControl>
                      <FormLabel className="font-normal">Failed</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation Code (e.g., M-Pesa Code)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Optional confirmation code"
                    {...field}
                    disabled={isFormDisabled}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Enter the transaction code if the payout was successful.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actualCharges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Charges (KES)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Optional actual charges incurred"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseFloat(value)
                      );
                    }}
                    value={field.value ?? ""}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                <FormDescription>
                  Enter the exact transaction cost, if different from estimated
                  fees.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional notes about the transaction (e.g., reason for failure)"
                    className="resize-none"
                    {...field}
                    disabled={isFormDisabled}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Server error display */}
          {formError && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Submitting</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          {/* Success message display (alternative to toast or can be used with it) */}
          {/* {formSuccess && (
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{formSuccess}</AlertDescription>
                </Alert>
            )} */}

          <Button type="submit" disabled={isFormDisabled}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Payout Status
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompletePayoutForm;
