// changed the layout
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Header } from "@/components/DepositHeader";
import { ArrowLeft } from "lucide-react";
import CompanyFooter from "@/components/TermsFooter";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout page",
};

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header
        leftIcon={<ArrowLeft className="h-6 w-6" />}
        showLogo={false}
        title="Checkout"
      />
      <main>{children}</main>
      <div className=" fixed bottom-5 left-0 right-0 p-5 bg-transparent ">
        <CompanyFooter />
      </div>
    </>
  );
}
