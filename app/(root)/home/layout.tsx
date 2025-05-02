import NavBar from "@/components/TopNavBar";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavBar />
      <main className="pt-4 pb-5">{children}</main>
    </>
  );
}
