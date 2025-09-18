import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
export const TermsPage = () => {
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
            Terms of Service
          </h1>
          <div className="prose max-w-none text-gray-700">
            <p className="font-medium">Last updated: January 1, 2025</p>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Introduction
            </h2>
            <p>
              Welcome to AfroScholarHub Nexus ("we," "our," or "us"). These
              Terms of Service ("Terms") govern your access to and use of the
              AfroScholarHub Nexus platform, including any content,
              functionality, and services offered on or through the platform
              (the "Service").
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              2. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, you may not
              access the Service.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              3. User Accounts
            </h2>
            <p>
              When you create an account with us, you must provide accurate,
              complete, and current information. Failure to do so constitutes a
              breach of the Terms, which may result in immediate termination of
              your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              4. Use of Service
            </h2>
            <p>
              The Service is provided for the purpose of managing ambassador and
              outreach activities for AfroScholarHub. Users are expected to use
              the Service in accordance with its intended purpose and in
              compliance with all applicable laws and regulations.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              5. Privacy Policy
            </h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy,
              which can be found{' '}
              <Link to="/privacy" className="text-ash-teal hover:underline">
                here
              </Link>
              .
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              6. Intellectual Property
            </h2>
            <p>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of AfroScholarHub and
              its licensors.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              7. Termination
            </h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              8. Limitation of Liability
            </h2>
            <p>
              In no event shall AfroScholarHub, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Service.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              9. Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws applicable to agreements made and to be performed in the
              jurisdictions where AfroScholarHub operates.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              10. Changes
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days' notice prior to any new terms taking
              effect.
            </p>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              11. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@afroscholarhub.org" className="text-ash-teal hover:underline">
                legal@afroscholarhub.org
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