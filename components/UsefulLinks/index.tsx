import Link from "next/link";
import {
  HelpCircle,
  Info,
  Lock,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react";

export function UsefulLinks() {
  return (
    <div className="space-y-8 px-4">
      {/* Help & Support */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500">Help & Support</h3>
        <div className="space-y-1">
          {supportLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <link.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{link.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500">Legal</h3>
        <div className="space-y-1">
          {legalLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <link.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{link.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const supportLinks = [
  {
    title: "Help Center",
    icon: HelpCircle,
    href: "#",
  },
  {
    title: "Contact Support",
    icon: MessageSquare,
    href: "#",
  },
  {
    title: "Account Settings",
    icon: Settings,
    href: "#",
  },
];

const legalLinks = [
  {
    title: "Privacy Policy",
    icon: Lock,
    href: "/privacy",
  },
  {
    title: "Terms of Service",
    icon: Shield,
    href: "/terms",
  },
  {
    title: "About Us",
    icon: Info,
    href: "#",
  },
];
