import { MainNav } from "@/components/Main-Nav";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-neutral-100 ">
        <MainNav />
        <main className="mt-16">{children}</main>
      </div>
    </>
  );
}
