"use client";

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
      href: "/home",
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
        "fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md",
        "bg-white/10 backdrop-blur-2xl backdrop-filter",
        "rounded-xl shadow-lg shadow-black/10 border-t border-white/20  z-50",
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
