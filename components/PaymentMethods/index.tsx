import { Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MpesaPaymentFormClient } from "./client";

interface MpesaPaymentFormProps {
  initialPaymentMethods: PaymentMethod[];
}
interface PaymentMethod {
  id: string;
  fullName: string;
  phoneNumber: string;
  isDefault: boolean;
}

// Server Component
export default async function MpesaPaymentForm({
  initialPaymentMethods,
}: MpesaPaymentFormProps) {
  // This can be replaced with data fetching logic.
  const paymentMethods = initialPaymentMethods;

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>M-Pesa Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={paymentMethods.find((m) => m.isDefault)?.id || ""}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{method.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
        {/* Delegate interactivity to the client-side */}
        <MpesaPaymentFormClient initialPaymentMethods={paymentMethods} />
      </CardContent>
    </Card>
  );
}
