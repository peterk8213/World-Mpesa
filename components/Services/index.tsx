import { ServiceCard } from "@/components/AppServicesCard";
import { Phone, Send, Receipt, Wallet, PiggyBank } from "lucide-react";

const services = [
  {
    icon: <Receipt className="h-6 w-6" />,
    title: "Withdraw",
    description: "Popular providers-[Mpesa, Mobile Money, airtel]",
    href: "/withdraw",
  },
  {
    icon: <PiggyBank />,
    title: "Deposit",
    description: "Deposit funds ",
    href: "/deposit",
  },
  {
    icon: <Send />,
    title: "Send Money",
    description: "Transfer to anyone",
    href: "/send",
  },
  {
    icon: <Phone />,
    title: "Airtime",
    description: "Buy phone credit",
    href: "/airtime",
  },
];

export function AppServices() {
  return (
    <section className="p-2">
      <h3 className="text-xl font-medium mb-6">Quick Services</h3>
      <div className="grid grid-cols-2 gap-4">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            href={service.href}
          />
        ))}
      </div>
    </section>
  );
}
