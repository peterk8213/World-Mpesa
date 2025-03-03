import Link from "next/link";
import { Button } from "@worldcoin/mini-apps-ui-kit-react/Button";
import { PlusCircle, Wallet } from "lucide-react";

export function NoAccounts() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 mx-auto">
      <div className="relative w-full max-w-md mx-auto animate-fade-in">
        <div className="relative z-10 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 rounded-2xl p-8 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 shadow-2xl shadow-gray-900/10">
          {/* Decorative elements */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-full blur-2xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg shadow-gray-900/10 hover:scale-105 transition-transform duration-300">
                <Wallet className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 text-center space-y-6">
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                No Accounts Found
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Add your first account to start managing your withdrawals
              </p>
            </div>

            <div className="animate-fade-in-up [animation-delay:200ms]">
              <Link href="/withdraw/add-account" className="block">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  radius="lg"
                  className="relative group"
                >
                  {/* Button background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                  <span className="relative flex items-center justify-center gap-2 font-medium group-hover:scale-[1.03] transition-transform duration-300">
                    <PlusCircle className="w-5 h-5" />
                    Add Account
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:500ms]" />
        </div>

        {/* Background grid */}
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
}
