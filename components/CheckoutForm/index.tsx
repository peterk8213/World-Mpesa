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

export function CheckoutForm({ amount }: { amount: string | any }) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(amount || "0"));

  const fee = parseFloat(amount || "0") * 0.015;
  const formattedFee = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(fee);

  const handlePay = () => {
    if (parseFloat(amount || "0") > 1000) {
      redirect("/error");
    } else {
      redirect("/success");
    }
  };

  return (
    <main className="flex-col h-full justify-around items-center">
      <div className="flex justify-center items-center">
        <Card className="w-[95%] lg:w-auto  bg-gray-100">
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
                <h3 className="text-gray-500 mb-2">Gas Fee (1.5%)</h3>
                <div className="font-semibold">{formattedFee}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col ">
            <div className="justify-center  items-center mt-2">
              <PayBlock />
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-auto fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>Powered by MpesaWorld</p>
          <p>
            By proceeding with "Pay," you accept the{" "}
            <a
              href="/terms"
              target="_blank"
              className="text-blue-500 underline"
            >
              Terms & Conditions
            </a>{" "}
            of MpesaWorld
          </p>
          <p>
            and agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              className="text-blue-500 underline"
            >
              Privacy Policy
            </a>{" "}
            of WLD.
          </p>
        </div>
      </div>
    </main>
  );
}
