import Link from "next/link";

const CompanyFooter = () => {
  return (
    <footer className="mt-auto py-8  px-6 outline-1 border-t border-gray-50 rounded-full backdrop-blur bg-transparent">
      <div className="container mx-auto px-4 text-gray-600">
        <div className="text-center text-sm ">
          <p className="font-semibold mb-2">Powered by Nekron</p>
          <p className="mb-2 justify-start">
            By proceeding, you accept the{" "}
            <Link
              href="/terms"
              className="text-primary hover:underline hover:text-secondary underline"
            >
              Terms & Conditions
            </Link>{" "}
            and agree to the{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            of WLD.
          </p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()}Nekron. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;
