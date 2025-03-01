import { ProfileNavBar } from "@/components/ProfileNavBar";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ProfileNavBar />
      <main className="pt-4">{children}</main>
    </>
  );
}
