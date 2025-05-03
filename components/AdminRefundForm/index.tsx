"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, Undo2, Info } from "lucide-react"; // Added Undo2 for refund icon

import { Badge } from "@/components/ui/badge";

import type { ManualPayout, RefundInput } from "@/types"; // Assuming RefundInput is defined in types

import { toastError, toastSuccess } from "@/lib/toast";

// Interface for the refund form data
interface RefundFormValues {
  reason: string;
}

interface RefundFormProps {
  payoutToRefund: ManualPayout;
  payoutId: string; // Keep payoutId for the action

  processRefundAction: Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

const RefundForm: React.FC<RefundFormProps> = ({
  payoutToRefund,
  payoutId,
  processRefundAction,
}) => {
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RefundFormValues>({
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (values: RefundFormValues) => {
    if (!values.reason) {
      form.setError("reason", {
        type: "manual",
        message: "Refund reason is required.",
      });
      return;
    }
    form.clearErrors("reason");

    setFormError(null);

    startTransition(async () => {
      const input: RefundInput = {
        payoutId,

        reason: values.reason,
      };

      const result = await processRefundAction(input);

      if (!result.success) {
        setFormError(
          result.message ||
            "An unknown error occurred during refund processing."
        );
        toastError(result.message || "An unknown error occurred.");
      } else {
        toastSuccess(result.message);
        form.reset(); // Reset form on success
        // Optional: Redirect back to payouts or a confirmation page
        router.back(); // Go back to the previous page
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Display Original Payout Details */}
      <div>
        <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" /> Original Payout Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border p-4 rounded-md bg-card text-card-foreground">
          <div>
            <span className="text-muted-foreground">Payout ID:</span>
            <br />
            <span className="font-mono text-xs">{payoutToRefund._id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">User ID:</span>
            <br />
            <span className="font-mono text-xs">{payoutToRefund.userId}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>
            <br />
            <span className="font-medium">{payoutToRefund.phoneNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Recipient:</span>
            <br />
            <span className="font-medium">
              {payoutToRefund.ReceiverPartyPublicName || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Amount (KES):</span>
            <br />
            <span className="font-medium">
              {payoutToRefund.amountinKes.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Amount (USD):</span>
            <br />
            <span className="font-medium">
              {payoutToRefund.amountinUsd.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <br />
            <Badge
              variant={
                payoutToRefund.status === "completed" ? "default" : "secondary"
              }
              className="capitalize"
            >
              {payoutToRefund.status}
            </Badge>
          </div>
          {payoutToRefund.confirmationCode && (
            <div>
              <span className="text-muted-foreground">Conf. Code:</span>
              <br />
              <span className="font-medium">
                {payoutToRefund.confirmationCode}
              </span>
            </div>
          )}
          {payoutToRefund.processedBy && (
            <div>
              <span className="text-muted-foreground">Processed By:</span>
              <br />
              <span className="font-mono text-xs">
                {payoutToRefund.processedBy}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Refund Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border p-4 rounded-md bg-card"
        >
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Undo2 className="h-5 w-5 text-primary" /> Initiate Refund
          </h3>
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Refund *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain why this payout is being refunded..."
                    className="resize-none bg-accent rounded-lg"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  This reason will be logged for auditing purposes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Server error display */}
          {formError && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Refund Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process Refund
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RefundForm;
