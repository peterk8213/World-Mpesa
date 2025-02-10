import { Heart, WalletMinimal } from "lucide-react";
import { redirect } from "next/navigation";
import { PayBlock } from "@/components/Pay";

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

  console.log("running on server");
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
    <main className="flex-col  justify-around items-center bg-white p-2 px-4 py-8 ">
      <div className="flex justify-center items-center overflow-auto">
        <div className="flex flex-col  w-full lg:w-1/2 pt-6 mt-4">
          <Card className="w-full lg:w-auto   xs:mt-6 ">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Confirm payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 p-2 rounded-lg">
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
        <div className="fixed bottom-12 left-0 right-0 p-5 ">
          <CompanyFooter />
        </div>
        <div className="justify-center  items-center mt-2 space-y-4">
          <PayBlock userAmount={userAmount} />
        </div>
      </div>
    </main>
  );
}
