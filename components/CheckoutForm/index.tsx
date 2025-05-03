import { Heart, WalletMinimal } from "lucide-react";
import { redirect } from "next/navigation";
import { PayBlock } from "@/components/Pay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import CompanyFooter from "@/components/TermsFooter";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getConversionRate } from "@/lib/wallet/conversion";

export async function CheckoutForm({ userAmount }: { userAmount: string }) {
  const conversionRate = await getConversionRate();

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(userAmount || "0"));

  const fee = parseFloat("0") * 0.015;
  const formattedFee = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(fee);

  const handlePay = () => {
    if (parseFloat(userAmount || "0") > 1000) {
      redirect("/error");
    } else {
      redirect("/success");
    }
  };

  return (
    <main className="flex-col  justify-around items-center  p-2 px-4 py-8 h-full overflow-auto ">
      <div className="flex justify-center items-center overflow-auto">
        <div className="flex flex-col  w-full lg:w-1/2 pt-6 mt-4 mb-10 gap-4">
          {/* Added Alert */}
          <Alert
            variant="default"
            className="mb-6 bg-yellow-50 border-yellow-200"
          >
            {" "}
            {/* Adjusted styling */}
            <AlertTriangle className="h-4 w-4 text-yellow-600" />{" "}
            {/* Changed icon and color */}
            <AlertTitle className="font-semibold text-yellow-800">
              Important Withdrawal Information
            </AlertTitle>{" "}
            {/* Adjusted styling */}
            <AlertDescription className="text-yellow-700">
              {" "}
              {/* Adjusted styling */}
              Withdrawals are currently only available for Kenyan phone numbers
              (+254). Attempts with other numbers will fail.
            </AlertDescription>
          </Alert>
          <Card className="w-full lg:w-auto   xs:mt-6  border-none  mb-15">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Confirm payment detail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-3">
                  <div className="  bg-red-400 p-2 rounded-xl">
                    <WalletMinimal className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold">
                    Top up Your wallet balance
                  </span>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-2">Deposit amount</h3>
                  <div className="text-xl font-semibold">{formattedAmount}</div>
                </div>

                <div>
                  <h3 className="text-gray-500 mb-2">Equivalent in Fiat</h3>
                  <div className="">
                    <div className="font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "KES",
                      }).format(parseFloat(userAmount || "0") * 129)}
                      <div>
                        <span className="text-xs text-gray-500">
                          1 USD ={" "}
                          <span className="text-xs">
                            {`${conversionRate.conversionRate.toFixed(0)}  KES`}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-2">Gas Fee (0.0%)</h3>
                  <div className="">{formattedFee}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="justify-center  items-center mt-2 space-y-4 bg-transparent py-2">
          <PayBlock userAmount={userAmount} />
        </div>
      </div>
    </main>
  );
}
