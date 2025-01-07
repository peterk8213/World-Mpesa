import { BottomNav } from "@/components/BottomNav";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main>{<BottomNav />}</main>
      {children}
    </>
  );
}
