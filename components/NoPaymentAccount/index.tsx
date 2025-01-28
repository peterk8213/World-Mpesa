import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
            <CreditCard className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            No Payment Methods
          </CardTitle>
          <CardDescription className="text-center">
            You haven't added any payment methods to your account yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            To use your wallet , you'll need to add a payment method to your
            profile.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/profile">Add Payment Method</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
