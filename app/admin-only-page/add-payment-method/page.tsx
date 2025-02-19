///// page for adding payment methods for the app oly accesciblr to admin

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { AddPaymentMethodForm } from "@/components/AddPaymentMethod";

import { addPaymentMethod } from "@/actions/AddPaymentMethod";

export default async function AddPaymentMethod() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen  w-full mx-auto flex flex-col px-2 pt-2">
      <AddPaymentMethodForm />
    </main>
  );
}
// Compare this snippet from components/AddPaymentMethod/index.tsx:
