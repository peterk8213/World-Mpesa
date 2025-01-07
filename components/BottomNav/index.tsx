"use client";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { History, Wallet, UserRound } from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className }: BottomNavProps) {
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      icon: <History />,
      label: "History",
      href: "/history",
    },
    {
      icon: <Wallet />,
      label: "Home",
      href: "/",
    },
    {
      icon: (
        <div className="w-6 h-6 rounded-full ">
          <UserRound className="text-black h-6 w-6" />
        </div>
      ),
      label: "Profile",
      href: "/profile",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 w-full bg-white border-t border-gray-00",
        className
      )}
    >
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-14 w-full rounded-none",
                pathname === item.href ? "text-black" : "text-gray-400"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
