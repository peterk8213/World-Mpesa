import { AddPaymentAccountHeader } from "@/components/AddPaymentAccountHeader";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AddPaymentAccountHeader />
      <main>{children}</main>
    </>
  );
}
