import { SuccessPage } from "@/components/TxnSuccessHeader";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <SuccessPage />
      <div className="mt-10 ">{children}</div>
    </main>
  );
}
