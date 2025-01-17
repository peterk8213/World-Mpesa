import { DepositKeypad } from "@/components/DepositKeypad";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/DepositHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header leftIcon={<ArrowLeft className="h-6 w-6" />} />
      <DepositKeypad />
    </div>
  );
}
