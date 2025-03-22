// Description: This file contains the constants used in the application.

import {
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Shield,
} from "lucide-react";
export const shareData = {
  message:
    "I just sent money using this fast and secure transfer app! Try it out.",
  link:
    process.env.APP_URL ??
    "https://worldcoin.org/mini-app?app_id=app_d826abbcef7ac8a14db406b6d2f7562d",
};

export const onboardingSteps: {
  id: string;
  title: string;
  icon: any;
  completed?: boolean;
  current?: boolean;
  link?: string;
}[] = [
  {
    id: "account",
    title: "Create Account",
    icon: Shield,
    completed: true,
  },
  {
    id: "link-payment",
    title: "Link Payment",
    icon: CreditCard,
    current: true,
    link: "/withdraw/add-account",
  },
  {
    id: "deposit",
    title: "First Deposit",
    icon: ArrowDownToLine,
    link: "/deposit",
  },
  {
    id: "withdraw",
    title: "First Withdrawal",
    icon: ArrowUpFromLine,
    link: "/withdraw",
  },
];
