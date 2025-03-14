"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { useRouter } from "next/navigation";

export function SuccessPage() {
  const router = useRouter();

  return (
    <header className=" fixed top-0 z-10  py-2 w-full backdrop-blur-xl ">
      <div className="container  mx-auto px-6 flex items-center justify-end ">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-black"
            onClick={() => router.push("/home")}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
