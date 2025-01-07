"use client";

import { useState } from "react";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";

interface PaymentMethod {
  id: string;
  fullName: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface MpesaPaymentFormClientProps {
  initialPaymentMethods: PaymentMethod[];
}

export function MpesaPaymentFormClient({
  initialPaymentMethods,
}: MpesaPaymentFormClientProps) {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSetDefaultPayment = (id: string) => {
    setIsLoading(true);
    try {
      console.log("set default payment method: id", {
        newFullName,
        newPhoneNumber,
      });
    } catch (error) {
      console.error("Failed to set default payment method:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setIsAddingPayment(false);
      setNewFullName("");
      setNewPhoneNumber("");
      router.refresh();
    } catch (error) {
      console.error("Failed to add payment method:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
        <DialogTrigger asChild>
          <div className="lg:mx-7">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New M-Pesa Number
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New M-Pesa Number</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="254XXXXXXXXX"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add M-Pesa Number"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
