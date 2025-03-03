import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button variant="outline" size="sm">
                Privacy Policy
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-4">
                  By accessing and using this website, you accept and agree to
                  be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    Permission is granted to temporarily access the materials on
                    our website
                  </li>
                  <li>
                    This is the grant of a license, not a transfer of title
                  </li>
                  <li>
                    You may not:
                    <ul className="list-circle pl-6 mt-2 space-y-1">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose</li>
                      <li>Remove any copyright or proprietary notations</li>
                      <li>Transfer the materials to another person</li>
                    </ul>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. User Account</h2>
                <p className="mb-4">
                  To access certain features of the website, you may be required
                  to create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Provide accurate information</li>
                  <li>Maintain the security of your account</li>
                  <li>Promptly update your account information</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Disclaimer</h2>
                <p className="mb-4">
                  The materials on our website are provided on an &apos;as
                  is&apos; basis. We make no warranties, expressed or implied,
                  and hereby disclaim and negate all other warranties including,
                  without limitation:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Implied warranties of merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement of intellectual property rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Limitations</h2>
                <p className="mb-4">
                  In no event shall we or our suppliers be liable for any
                  damages arising out of the use or inability to use the
                  materials on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Revisions</h2>
                <p className="mb-4">
                  We may revise these terms of use at any time without notice.
                  By using this website, you agree to be bound by the current
                  version of these terms of service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
                <p className="mb-4">
                  These terms and conditions are governed by and construed in
                  accordance with applicable laws, and you irrevocably submit to
                  the exclusive jurisdiction of the courts.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
                <p className="mb-4">
                  If you have any questions about these Terms of Use, please
                  contact us at:
                  <br />
                  <a
                    href="mailto:legal@example.com"
                    className="text-primary hover:underline"
                  >
                    legal@example.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
