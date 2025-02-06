import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <h1 className="mb-8 text-center text-3xl font-bold">
            Terms and Conditions
          </h1>

          <section className="space-y-6">
            <div>
              <h2 className="mb-3 text-xl font-semibold">Introduction</h2>
              <p className="text-gray-700">
                Welcome to Tutionwala.com. By accessing and using our website
                (https://www.tutionwala.com/) and its services, you agree to be
                bound by these Terms and Conditions. If you do not agree with
                any of the terms stated herein, you must not use our website.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">Definitions</h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  &quot;Tutionwala,&quot; &quot;we,&quot; &quot;us,&quot; or
                  &quot;our&quot; refers to Tutionwala.com and its operators.
                </li>
                <li>
                  &quot;User,&quot; &quot;you,&quot; or &quot;your&quot; refers
                  to any individual accessing or using our website and services.
                </li>
                <li>
                  &quot;Tutionwala Professional&quot; refers to tutors,
                  teachers, lecturers, instructors, or coaching institutions
                  registered on our website.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">Eligibility</h2>
              <p className="text-gray-700">
                You must be at least 18 years old to register and use our
                services. By using our website, you confirm that you are legally
                capable of entering into a binding contract.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">User Account</h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  To access certain services, users must register and create an
                  account.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </li>
                <li>
                  You agree to provide accurate and updated information when
                  registering on our website.
                </li>
                <li>
                  We reserve the right to suspend or terminate accounts that
                  provide false or misleading information.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">
                Use of Website and Services
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  You agree to use the website in compliance with applicable
                  laws and regulations.
                </li>
                <li>
                  You shall not misuse the website for any fraudulent, unlawful,
                  or harmful activities.
                </li>
                <li>
                  We reserve the right to restrict, suspend, or terminate access
                  to users violating our terms.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">
                Payments and Transactions
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Users engaging in transactions on Tutionwala.com agree to
                  provide accurate payment details.
                </li>
                <li>
                  Payments processed through third-party gateways are subject to
                  their terms and conditions.
                </li>
                <li>We do not store your financial information.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">Refund Policy</h2>
              <p className="text-gray-700">
                We are not providing any kind of refund.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">Privacy Policy</h2>
              <p className="text-gray-700">
                Your use of our services is also governed by our Privacy Policy,
                which outlines how we collect, use, and protect your personal
                information.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">
                Limitation of Liability
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Tutionwala is not liable for any direct, indirect, incidental,
                  or consequential damages arising from the use of our website.
                </li>
                <li>
                  We do not guarantee the accuracy, reliability, or completeness
                  of information provided by users or third parties.
                </li>
                <li>
                  We shall not be responsible for disputes arising between users
                  and Tutionwala Professionals.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">
                Intellectual Property
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  All content, trademarks, logos, and materials on our website
                  are the intellectual property of Tutionwala.com.
                </li>
                <li>
                  Users may not copy, distribute, or reproduce any content
                  without prior written consent.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">
                Changes to Terms and Conditions
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  We reserve the right to modify these Terms and Conditions at
                  any time.
                </li>
                <li>
                  Users are encouraged to review the terms periodically for
                  updates.
                </li>
                <li>
                  Continued use of the website signifies acceptance of the
                  revised terms.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">
                Governing Law and Jurisdiction
              </h2>
              <p className="text-gray-700">
                These Terms and Conditions are governed by the laws of India.
                Any disputes shall be subject to the exclusive jurisdiction of
                the courts in India.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold">
                Contact Information
              </h2>
              <p className="text-gray-700">
                For any questions regarding these Terms and Conditions, you may
                contact us at{" "}
                <a
                  href="tel:+919266415151"
                  className="text-primary hover:underline"
                >
                  +91 9266415151
                </a>
                .
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
