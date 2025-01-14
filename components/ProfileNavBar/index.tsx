"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function ProfileNavBar() {
  const handleLogout = () => {
    signOut();
    router.push("/");
  };
  const router = useRouter();

  return (
    <div className=" border-b-4  border-gray-200">
      <header className=" sticky flex justify-between items-center p-1  bg-opacity-10 backdrop-blur-md mb-4">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-gradient-to-br from-green-200 to-gray-200 hover:shadow-xl hover:shadow-blue-100 focus:shadow-xl focus:shadow-blue-100 transition-shadow duration-200"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
        <div>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>

        <div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-gradient-to-br from-red-200 to-pink-200 hover:shadow-xl hover:shadow-blue-100 focus:shadow-xl focus:shadow-blue-100 transition-shadow duration-200"
            onClick={handleLogout}
          >
            <LogOut className=" h-5 w-5" />
          </Button>
        </div>
      </header>
    </div>
  );
}
