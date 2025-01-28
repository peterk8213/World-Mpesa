import CompanyFooter from "@/components/TermsFooter";
// changed the layout
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div>
        {/* {<Header leftIcon={<ArrowLeft className="h-6 w-6" />} />} */}
        {children}
        <CompanyFooter />
      </div>
    </>
  );
}
