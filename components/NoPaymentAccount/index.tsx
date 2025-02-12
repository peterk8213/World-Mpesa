import Link from "next/link";
import { CreditCard } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NoPaymentMethodsPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center">
      <Card className="w-full max-w-md backdrop-blur bg-slate-300">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
            <CreditCard className="w-6 h-6 text-yellow-600" />
          </div>

          <CardDescription className="text-left">
            You haven't added any payment methods to your account yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            To use your wallet , you'll need to add a payment method to your
            profile.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
