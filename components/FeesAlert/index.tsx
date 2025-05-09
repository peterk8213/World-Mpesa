"use client";

import { useState } from "react";
import { AlertCircle, Info, ExternalLink, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { batches } from "@/lib/wallet/getFees";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@worldcoin/mini-apps-ui-kit-react/Drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeeWarningProps {
  amount: number;
  totalFee: number;
  netAmount: number;
}

export function FeeWarning({ amount, totalFee, netAmount }: FeeWarningProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only render when amount is less than 2
  if (amount >= 4) {
    return null;
  }

  // Get the fee details for the current amount

  const feePercentage = amount > 0 ? (totalFee / amount) * 100 : 0;

  return (
    <>
      <Alert className="mb-4 border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 font-medium">
          Higher fee percentage
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          <p className="mt-1">
            Withdrawals below 2 USD have a higher fee percentage (
            {feePercentage.toFixed(1)}%). Consider withdrawing larger amounts
            for better rates.
          </p>
          <Button
            variant="link"
            className="p-0 h-auto text-amber-800 font-medium mt-1 flex items-center"
            onClick={() => setIsDialogOpen(true)}
          >
            Learn more about our fees <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>

      <Drawer open={isDialogOpen}>
        <DrawerContent className="max-w-md pb-2">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Fee Structure</h2>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 px-3">
            <p className="text-sm text-slate-700 mb-2">
              Our fee structure is designed to be transparent and fair. Below is
              a breakdown of the fees associated with your withdrawal amount:
            </p>
            <p className="text-sm text-slate-700 mb-2">
              The fee is calculated based on the following structure:
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount Range</TableHead>
                  <TableHead>Percentage Fee</TableHead>
                  <TableHead>Fixed Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch, index) => {
                  const nextBatch = batches[index - 1];
                  const max = nextBatch ? nextBatch.min - 0.01 : "∞";

                  return (
                    <TableRow
                      key={batch.min}
                      className={
                        amount >= batch.min &&
                        amount < (nextBatch?.min || Number.POSITIVE_INFINITY)
                          ? "bg-amber-50"
                          : ""
                      }
                    >
                      <TableCell>
                        {batch.min} - {max}
                      </TableCell>
                      <TableCell>{batch.percent}%</TableCell>
                      <TableCell>{batch.fixed}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <p className="font-medium">Your current withdrawal:</p>
                  <p>Amount: {amount}</p>
                  <p>
                    Fee: {totalFee.toFixed(2)} ({feePercentage.toFixed(1)}%)
                  </p>
                  <p>Net amount: {netAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
