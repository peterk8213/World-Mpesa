"use client";

import { Provider, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import Form from "next/form";
import { useState } from "react";

import { PhoneField } from "@worldcoin/mini-apps-ui-kit-react/PhoneField";

import { Input } from "@worldcoin/mini-apps-ui-kit-react/Input";

import { Select } from "@worldcoin/mini-apps-ui-kit-react/Select";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
import { Checkbox } from "@worldcoin/mini-apps-ui-kit-react/Checkbox";
import { Form as MiniKitForm } from "@worldcoin/mini-apps-ui-kit-react/Form";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react/Typography";

import { motion } from "framer-motion";
import { PayoutProvider } from "@/types";
import { toastError, toastInfo } from "@/lib/toast";

export function AddPaymentAccountForm({
  addPaymentAccount,
  providers,
}: {
  addPaymentAccount: any;
  providers:
    | {
        value: string;
        label: string;
      }[];
}) {
  interface State {
    success?: boolean;
    error?: string;
    pending?: boolean;
  }

  //  i want to dynamically acesss the changing field and update state

  const [state, formAction] = useActionState<State>(addPaymentAccount, {
    pending: false,
  });

  const router = useRouter();
  const { data: session, status } = useSession();
  const { isnewUser } = session;

  const [isDefault, setIsDefault] = useState(isnewUser);

  const isPhoneValid = () => {
    //// a regex that checks if the phone number is valid generate one
    // Kenyan phone number regex: Supports +2547XXXXXXXX or 07XXXXXXXX format
    const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
    const phone = paymentAccount.phoneNumber;

    if (!phoneRegex.test(phone)) {
      return false;
    }
    return true;
  };

  function isValidFullName(name: string): boolean | undefined {
    const fullNameRegex = /^[A-Z][a-zA-Z'-]{1,} [A-Z][a-zA-Z'-]{1,}$/;
    return fullNameRegex.test(name);
  }

  /// define types for the state

  const [paymentAccount, setpaymentAccount] = useState({
    fullName: "",
    phoneNumber: "",
    provider: "",
    isDefault: false,

    isFullNameValid: false,
    isPhoneNumberValid: false,
  });

  console.log(providers);

  useEffect(() => {
    if (state?.success) {
      toastInfo("Payment account added successfully");
    }
    if (state?.error) {
      toastError(state.error);
    }
  }, [state]);

  return (
    <Form
      action={formAction}
      className="space-y-4 flex flex-col gap-4 pt-4 mt-4 w-full md:w-auto"
    >
      {state?.error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}

      <Typography variant="heading">Payment Account Details</Typography>
      <div>
        <label htmlFor="fullName" className="block mb-1 p-1">
          <Typography>Full Name </Typography>
        </label>
        <Input
          type="text"
          id="fullName"
          name="fullName"
          required
          minLength={7}
          placeholder="Enter your full name"
          onChange={(e) => {
            const isValid = isValidFullName(e.target.value);
            setpaymentAccount((prev) => ({
              ...prev,
              fullName: e.target.value,
              isFullNameValid: isValid ?? false,
            }));
          }}
          isValid={paymentAccount.isFullNameValid}
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block mb-1 p-1">
          <Typography> Phone Number </Typography>
        </label>

        <PhoneField
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          countrySelectorMode="drawer"
          required
          hideDialCode
          defaultCountryCode="KE"
          isValid={isPhoneValid()} // check if the phone number is valid
        />
      </div>

      <div>
        <label htmlFor="provider" className="block mb-1 p-1">
          <Typography> Provider </Typography>
        </label>
        <Select name="provider" required options={providers} />
      </div>
      <div className="flex items-center gap-6 p-2 ">
        <label htmlFor="phoneNumber" className="block mb-1">
          Set Default
        </label>
        <Checkbox
          name="isdefault"
          onChange={(e) => {
            setIsDefault(e.valueOf());
          }}
          checked={isDefault}
        />
      </div>

      <motion.div
        className="flex items-center justify-center fixed bottom-4 w-full p-6 right-0 left-0 xs:bottom-0"
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
        >
          {state?.pending ? "Adding..." : "Add Payment Account"}
        </Button>
      </motion.div>
    </Form>
  );
}
