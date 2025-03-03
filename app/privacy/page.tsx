import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
            <Link href="/terms">
              <Button variant="outline" size="sm">
                Terms of Use
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  1. Information We Collect
                </h2>
                <p className="mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Username and authentication information</li>
                  <li>Contact information (email address)</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Protect against malicious or fraudulent activity</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  3. Information Sharing
                </h2>
                <p className="mb-4">
                  We do not share your personal information with third parties
                  except:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your
                  personal information. However, no method of transmission over
                  the Internet is 100% secure, and we cannot guarantee absolute
                  security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
                <p className="mb-4">
                  If you have questions about this Privacy Policy, please
                  contact us at:
                  <br />
                  <a
                    href="mailto:privacy@example.com"
                    className="text-primary hover:underline"
                  >
                    privacy@example.com
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
