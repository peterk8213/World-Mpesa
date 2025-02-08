import Link from "next/link";

const CompanyFooter = () => {
  return (
    <footer className="mt-auto py-6  px-6 outline-1 border-t border-gray-200 rounded-full">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">Powered by MpesaWorld</p>
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
            © {new Date().getFullYear()} MpesaWorld. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;
