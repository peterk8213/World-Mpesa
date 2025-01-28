import { Heart, WalletMinimal } from "lucide-react";
import { redirect } from "next/navigation";
import { PayBlock } from "@/components/Pay";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CheckoutForm({ userAmount }: { userAmount: string }) {
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
    <main className="flex-col h-full justify-around items-center">
      <div className="flex justify-center items-center">
        <Card className="w-[95%] lg:w-auto  bg-gray-100 xs:mt-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Confirm payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
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
                <h3 className="text-gray-500 mb-2">Gas Fee (0.0%)</h3>
                <div className="font-semibold">{formattedFee}</div>
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
                        1 USD = 127 KES
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col ">
            <div className="justify-center  items-center mt-2">
              <PayBlock userAmount={userAmount} />
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
