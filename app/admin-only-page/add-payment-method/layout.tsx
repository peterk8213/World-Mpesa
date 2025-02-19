import { AddPaymentMethodHeader } from "@/components/Admin-Add-Payment-method-Header";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AddPaymentMethodHeader />
      {children}
    </>
  );
}
