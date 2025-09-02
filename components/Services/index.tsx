import { ServiceCard } from "@/components/AppServicesCard";
import { Phone, Send, Receipt, HelpCircle, PiggyBank } from "lucide-react";

const services = [
  {
    icon: <PiggyBank />,
    title: "Deposit",
    description: "Deposit funds ",
    href: "/deposit",
  },
  {
    icon: <Receipt className="h-6 w-6" />,
    title: "Withdraw",
    description: "Popular providers-[Mpesa, Mobile Money, airtel]",
    href: "/withdraw",
  },
  {
    icon: <Send />,
    title: "Send Money",
    description: "Transfer to anyone",
    href: "/send",
  },
  {
    icon: <HelpCircle />,
    title: "Need Help?",
    description: " Our support team is here to help ",
    href: "mailto:peterwilliams8213@gmail.com",
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
