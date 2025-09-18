import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
export const PrivacyPolicyPage = () => {
  return <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-end">
              <span className="text-3xl font-bold text-ash-teal">ASH</span>
              <span className="ml-1 text-lg font-medium text-ash-dark">
                Nexus
              </span>
            </Link>
            <Link to="/" className="flex items-center text-sm font-medium text-ash-teal hover:text-ash-teal/80">
              <ArrowLeftIcon size={16} className="mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <div className="prose max-w-none text-gray-700">
            <p className="font-medium">Last updated: January 1, 2025</p>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Introduction
            </h2>
            <p>
              AfroScholarHub Nexus ("we," "our," or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our platform.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              2. Information We Collect
            </h2>
            <p>
              <strong>Personal Information</strong>: We may collect personally
              identifiable information, such as your name, email address,
              telephone number, and organization when you register for an
              account.
            </p>
            <p>
              <strong>Usage Data</strong>: We may collect information on how the
              Service is accessed and used, including your computer's Internet
              Protocol address, browser type, pages visited, time spent on
              pages, and other diagnostic data.
            </p>
            <p>
              <strong>School and Outreach Data</strong>: Information about
              schools, partnerships, and outreach activities that you enter into
              the system.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              3. How We Use Your Information
            </h2>
            <p>We use the collected data for various purposes:</p>
            <ul className="list-disc pl-5">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>
                To allow you to participate in interactive features of our
                Service
              </li>
              <li>To provide customer support</li>
              <li>
                To gather analysis or valuable information to improve our
                Service
              </li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              4. Data Retention
            </h2>
            <p>
              We will retain your personal information only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use your information to the extent necessary to comply
              with our legal obligations, resolve disputes, and enforce our
              policies.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              5. Data Security
            </h2>
            <p>
              The security of your data is important to us, but remember that no
              method of transmission over the Internet or method of electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your personal information, we cannot
              guarantee its absolute security.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              6. Third-Party Services
            </h2>
            <p>
              Our Service may contain links to other sites that are not operated
              by us. If you click on a third-party link, you will be directed to
              that third party's site. We strongly advise you to review the
              Privacy Policy of every site you visit.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              7. Children's Privacy
            </h2>
            <p>
              Our Service does not address anyone under the age of 18. We do not
              knowingly collect personally identifiable information from anyone
              under the age of 18.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              9. Your Data Protection Rights
            </h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, such as the right to access, correct,
              or delete your personal information.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{' '}
              <a href="mailto:privacy@afroscholarhub.org" className="text-ash-teal hover:underline">
                privacy@afroscholarhub.org
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2025 AfroScholarHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-ash-teal">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-ash-teal">
                Privacy
              </Link>
              <Link to="/help" className="text-sm text-gray-500 hover:text-ash-teal">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};