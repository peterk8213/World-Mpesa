"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const paymentMethods = [
  {
    id: 1,
    name: "PayPal",
    shortName: "PP",
    processingTime: "1-2 days",
    fee: "2.9% + $0.30",
    minAmount: "$1.00",
    maxAmount: "$10,000.00",
    available: true,
  },
  {
    id: 2,
    name: "Stripe",
    shortName: "ST",
    processingTime: "Instant",
    fee: "2.9% + $0.30",
    minAmount: "$1.00",
    maxAmount: "$50,000.00",
    available: true,
  },
  {
    id: 3,
    name: "Bank Transfer",
    shortName: "BT",
    processingTime: "2-3 days",
    fee: "$15.00",
    minAmount: "$100.00",
    maxAmount: "$100,000.00",
    available: false,
  },
];

export function PaymentMethodsTable() {
  const [methods, setMethods] = useState(paymentMethods);

  const toggleAvailability = (id: number) => {
    setMethods(
      methods.map((method) =>
        method.id === id ? { ...method, available: !method.available } : method
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your available payment methods
            </CardDescription>
          </div>
          <Link href="/admin-only-page/add-payment-method">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Min Amount</TableHead>
                <TableHead>Max Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method, index) => (
                <motion.tr
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>{method.processingTime}</TableCell>
                  <TableCell>{method.fee}</TableCell>
                  <TableCell>{method.minAmount}</TableCell>
                  <TableCell>{method.maxAmount}</TableCell>
                  <TableCell>
                    <Badge variant={method.available ? "outline" : "secondary"}>
                      {method.available ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={method.available}
                      onCheckedChange={() => toggleAvailability(method.id)}
                    />
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
