import Link from "next/link";
import { cn } from "@/lib/utils";
import type React from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 fixed   ">
      <div className="container flex h-16 items-center">
        <nav
          className={cn(
            "flex items-center space-x-4 lg:space-x-6 p-5  h-16 ",
            className
          )}
          {...props}
        >
          <Link
            href="/admin-only-page"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Overview
          </Link>
          <Link
            href="/admin-only-page/users"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Users
          </Link>
          <Link
            href="/admin-only-page/payout"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Payments
          </Link>
          <Link
            href="/admin/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
