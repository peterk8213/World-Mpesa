import SignInButton from "@/components/SignInButton";
import { Suspense } from "react";

export default function SignIn() {
  return (
    <>
      <div className=" overscroll-none h-screen overflow-hidden items-center">
        <div className="flex flex-col h-[100dvh] items-center justify-center bg-white text-black px-4">
          <p className="text-center mb-6">Not Signed In</p>
          <h1 className="text-3xl font-bold mb-4 text-center">
            Welcome to World Wallet
          </h1>
          <p className="text-center mb-6 text2-xl">
            Please authenticate with World ID to access your wallet.
          </p>
          <SignInButton />
        </div>
      </div>
    </>
  );
}

{
  /* Worldcoin IDKit Widget */
}
{
  /* <IDKitWidget
  app_id="app_d826abbcef7ac8a14db406b6d2f7562d" // Replace this with your Worldcoin app ID
  action="world-mpesa-withdrawals" // Unique action identifier
  onSuccess={handleSuccess}
  handleVerify={handleVerify}
>
  {({ open }) => (
    <Button
      onClick={open}
      className="px-6 py-3 text-white text-lg font-semibold rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300"
    >
      Authenticate with World ID
    </Button>
  )}
</IDKitWidget> */
}
