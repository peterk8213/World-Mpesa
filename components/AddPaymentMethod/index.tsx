"use client";

import { useActionState } from "react";
import { useState, useEffect } from "react";
import { Input } from "@worldcoin/mini-apps-ui-kit-react/Input";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react/Typography";
import { Switch } from "@worldcoin/mini-apps-ui-kit-react/Switch";
import Form from "next/form";
import { motion } from "framer-motion";
import { addPaymentMethod } from "@/actions/AddPaymentMethod";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { Separator } from "@radix-ui/react-select";

import { toastError, toastInfo, toastSuccess } from "@/lib/toast";

interface State {
  success?: boolean;
  error?: string;
  pending?: boolean;
}

export function AddPaymentMethodForm() {
  const [state, formAction] = useActionState<State>(addPaymentMethod, {
    pending: false,
  });

  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(1000);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   if (maxAmount <= minAmount) {
  //     setError("Maximum amount must be greater than minimum amount");
  //   } else {
  //     setError("");
  //   }
  // }, [minAmount, maxAmount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (state?.error && !state?.pending) {
    toastError(state.error);
  }
  if (state?.success && !state?.pending) {
    toastSuccess("Payment method added successfully!");
  }
  if (state?.pending && !state?.error && !state?.success) {
    toastInfo("Adding payment method...");
  }

  return (
    <div className="px-4 flex flex-col pt-8 md:w-auto md:mx-auto">
      <Form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Method Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            minLength={3}
            placeholder="Bank Transfer"
          />
        </div>

        <div>
          <label htmlFor="shortname" className="block mb-1 p-1">
            <Typography>Short Name</Typography>
          </label>
          <Input
            type="text"
            id="shortname"
            name="shortname"
            required
            minLength={3}
            placeholder="Bank"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 p-1">
            <Typography>Description</Typography>
          </label>
          <Input
            type="text"
            id="description"
            name="description"
            required
            minLength={7}
            placeholder="Short Description"
          />
        </div>

        <div>
          <label htmlFor="iconUrl" className="block mb-1 p-1">
            <Typography>Icon URL</Typography>
          </label>
          <Input
            type="url"
            id="iconUrl"
            name="iconUrl"
            required
            placeholder="https://example.com/icon.png"
          />
        </div>

        <div>
          <label htmlFor="fee" className="block mb-1 p-1">
            <Typography>Fee (%)</Typography>
          </label>
          <Input
            type="number"
            id="fee"
            name="fee"
            required
            min="0"
            max="100"
            step="0.01"
            placeholder="2.5"
          />
        </div>

        <div>
          <label htmlFor="processingTime" className="block mb-1 p-1">
            <Typography>Processing Time </Typography>
          </label>
          <Input
            type="text"
            id="processingTime"
            name="processingTime"
            required
            placeholder="Instant"
          />
        </div>
        <div className="space-y-4 px-2">
          <div>
            <label htmlFor="minAmount" className="block mb-1 p-1">
              <Typography>Minimum Amount</Typography>
            </label>
            <Slider
              defaultValue={[minAmount]}
              max={100}
              step={1}
              onValueChange={(value) => setMinAmount(value[0])}
            />
            <div className="flex justify-between mt-2">
              <span>{formatCurrency(minAmount)}</span>
            </div>
            <input type="hidden" name="minAmount" value={minAmount} />
          </div>

          <div>
            <label htmlFor="maxAmount" className="block mb-1 p-1">
              <Typography>Maximum Amount</Typography>
            </label>
            <Slider
              defaultValue={[maxAmount]}
              min={minAmount}
              max={10000}
              step={100}
              onValueChange={(value) => setMaxAmount(value[0])}
              color="red"
            />
            <div className="flex justify-between mt-2">
              <span> {formatCurrency(maxAmount)}</span>
            </div>
            <input type="hidden" name="maxAmount" value={maxAmount} />
          </div>

          {error && <div className="text-red-500">{error}</div>}
        </div>

        <Card className="p-4 bg-slate-50">
          <CardTitle>
            <Typography variant="h3">Availabile</Typography>
          </CardTitle>
          <Separator className="text-black" />
          <CardContent className="flex flex-row items-center justify-between  p-4">
            <div className="flex items-center  p-2">
              <Typography>
                Make this payment method available to users
              </Typography>
              <div className=" ml-4">
                <Switch name="available" />
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          className="flex items-center justify-center  w-full py-4 right-0 left-0 xs:bottom-0 sticky"
          initial={{ y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 1.4 }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            type="submit"
            fullWidth
            variant={!state?.pending ? "primary" : "secondary"}
            radius="md"
            isLoading={state?.pending}
            disabled={!!error}
          >
            {state?.pending ? "Adding..." : "Add Payment Method"}
          </Button>
        </motion.div>
      </Form>
    </div>
  );
}
