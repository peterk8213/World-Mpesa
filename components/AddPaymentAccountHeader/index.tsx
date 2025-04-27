"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";

import { useRouter } from "next/navigation";

import Link from "next/link";

export function AddPaymentAccountHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10  border-b  py-2 w-full">
      <div className="container  mx-auto px-6 flex items-center justify-end">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-black"
            onClick={() => router.back()}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
