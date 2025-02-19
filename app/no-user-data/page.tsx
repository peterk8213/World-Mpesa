import Link from "next/link";

import { AlertCircle, LogOut } from "lucide-react";
import { SignOutButton } from "@/components/Signout";

export default function NoUserData() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20">
        <div className="max-w-md w-full space-y-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            No User Data Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't find any data associated with your account. This could
            be due to a new account or a data issue.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Refresh this page or sign out and sign back in to try again later.
          </p>
          <div className="mt-5 space-y-4 p-8">
            <Link
              href="/home"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Return to Home
            </Link>
            <SignOutButton />
          </div>
        </div>
      </div>
    </>
  );
}
