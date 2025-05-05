"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, AlertCircle, Edit2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@worldcoin/mini-apps-ui-kit-react/Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@worldcoin/mini-apps-ui-kit-react/Input";

interface AddressDrawerProps {
  onAddressSelected: (address: string) => void;
}

function isValidWorldChainAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function AddressDrawer({ onAddressSelected }: AddressDrawerProps) {
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      setError("Address is required");
      return;
    }

    if (!isValidWorldChainAddress(address)) {
      setError("Please enter a valid Worldchain wallet address");
      return;
    }

    onAddressSelected(address);

    setAddress("");
    setError("");

    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className="rounded-full py-4 hover:underline w-full flex items-center justify-center"
        >
          Add custom address
          <Edit2 className="h-5 w-5 ml-2" />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className="p-6 w-full max-w-md mx-auto"
        aria-describedby="wallet-description warning-message"
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 gap-4">
          <div className="space-y-2 w-full rounded-lg p-4 gap-4">
            <Label htmlFor="wallet-address">Worldchain Wallet Address</Label>
            <div className="w-full px-2 py-1 rounded-lg flex items-center gap-2">
              <Input
                id="wallet-address"
                type="text"
                name="wallet-address"
                required
                minLength={42}
                maxLength={42}
                placeholder="0x..."
                value={address}
                isValid={isValid}
                error={!isValid}
                onChange={(e) => {
                  const value = e.target.value;
                  setAddress(value);
                  const valid = isValidWorldChainAddress(value);
                  setIsValid(valid);
                  setError(
                    valid
                      ? ""
                      : "Please enter a valid Worldchain wallet address"
                  );
                }}
              />
            </div>
            <p id="wallet-description" className="text-xs text-gray-500">
              Enter the full Worldchain address where you want to receive your
              refund
            </p>
          </div>

          {error && (
            <div
              id="wallet-error"
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div
            id="warning-message"
            className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
          >
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">
              <strong>WARNING:</strong> Sending to a non-Worldchain address will
              result in permanent loss of funds. Double-check your address
              before continuing.
            </p>
          </div>

          <div className="flex items-center justify-center w-full left-0 md:mx-auto lg:mx-auto lg:max-w-md px-4">
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full py-4"
              variant="default"
              disabled={!isValid || !address}
            >
              Confirm
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
