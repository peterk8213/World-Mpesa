"use client";

import { InfoItem } from "@/components/InfoItem";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { WithdrawRequestCheckout } from "@/types";
import { User, Phone, Briefcase, DollarSign, Barcode } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WithdrawCheckoutpage({
  withdrawCheckoutData,
}: {
  withdrawCheckoutData: WithdrawRequestCheckout;
}) {
  const {
    orderDetails: {
      totalAmount,
      estimatedTime,
      conversionRate,
      fiatAmount,
      fees: { totalFee: fees },
      method,
      walletBalance,
      amount: withdrawAmount,
    },
    accountdetails: { accountHolderName, phoneNumber, provider },
  } = withdrawCheckoutData;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: easeInOut },
      }}
      className="w-full mx-auto  overflow-auto  min-h-full "
    >
      <div className=" h-full ">
        <div className=" px-2 py-4 space-y-4 min-h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <p> Order Details</p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 px-4 py-3 ">
                  <div className="flex justify-between items-center ">
                    <span className="text-sm text-gray-600">
                      Withdraw Amount
                    </span>
                    <span className="font-medium">
                      {parseFloat(withdrawAmount).toFixed(2)}
                      <span className="text-xs"> USD</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Exchange Rates
                    </span>
                    <span className="font-sm">
                      {conversionRate.toFixed(0)}
                      {<span className="text-xs"> KES/USD</span>}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fees</span>
                    <span className="font-sm">
                      {fees.toFixed(2)}
                      <span className="text-xs"> USD</span>
                    </span>
                  </div>
                  <div className="py-2">
                    <Separator className="" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">Total</span>
                    </div>
                    <span className="font-semibold ">
                      {totalAmount.toFixed(2)}
                      <span className="text-xs"> USD</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fiat</span>
                    <span className="font-sm">
                      {fiatAmount.toFixed(0)}
                      <span className="text-xs "> KES</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Transfer Method
                    </span>

                    <p className="text-sm">{method}</p>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-gray-600">
                      Estimated Time
                    </span>
                    <span className="text-xs">{estimatedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div>
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Payment Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center space-x-2">
                  <InfoItem
                    label="Account Holder"
                    value={accountHolderName}
                    icon={<User className="w-4 h-4 text-gray-600" />}
                    className="font-medium"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <InfoItem
                    label="Phone Number"
                    value={phoneNumber.slice(0, -2) + "**"}
                    icon={<Phone className="w-4 h-4 text-gray-800" />}
                    className=" "
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <InfoItem
                    label="Provider"
                    value={provider.toUpperCase()}
                    icon={<Briefcase className="w-4 h-4 text-gray-600" />}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <footer className=" p-4 text-center w-full">
        &copy; {new Date().getFullYear()} MpesaWorld
      </footer>
    </motion.div>
  );
}
