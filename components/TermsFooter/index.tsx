const CompanyFooter = () => {
  return (
    <div>
      <div className="mt-auto fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>Powered by MpesaWorld</p>
          <p>
            By proceeding with "Pay," you accept the{" "}
            <a
              href="/terms"
              target="_blank"
              className="text-blue-500 underline"
            >
              Terms & Conditions
            </a>{" "}
            of MpesaWorld
          </p>
          <p>
            and agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              className="text-blue-500 underline"
            >
              Privacy Policy
            </a>{" "}
            of WLD.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyFooter;
