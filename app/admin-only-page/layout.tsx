import { MainNav } from "@/components/Main-Nav";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MainNav />
      <main className=" ">{children}</main>
    </>
  );
}
