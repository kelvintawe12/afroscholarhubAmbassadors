import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, AlertTriangleIcon, CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../utils/supabase';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        // Supabase will return an error if the email doesn't exist or other issues
        setError('Unable to send reset email. Please check your email address or try again later.');
      } else {
        setSuccess('If an account with this email exists, a password reset link has been sent. Check your inbox.');
        setEmailSent(true);
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-12 sm:w-1/2 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10 flex flex-col items-center animate-fade-in">
              <div className="flex items-end">
                <span className="text-4xl font-bold text-ash-teal">
                  AfroScholar
                </span>
                <span className="ml-2 text-xl font-medium text-ash-dark">
                  Hub
                </span>
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ambassador & Outreach Management Platform
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700 animate-slide-up">
                <AlertTriangleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-start rounded-md border-l-4 border-green-500 bg-green-50 p-3 text-sm text-green-700 animate-slide-up">
                <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-fade-in">
              <div className="mb-6">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-ash-teal hover:text-ash-teal/80 transition-colors duration-200"
                >
                  <ArrowLeftIcon size={16} className="mr-1" />
                  Back to sign in
                </Link>
              </div>

              <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
                Reset your password
              </h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {!emailSent ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MailIcon size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal transition-all duration-300"
                        placeholder="Enter your work email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    fullWidth
                    isLoading={isLoading}
                    className="transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Send reset email
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <CheckCircleIcon size={48} className="mx-auto mb-4 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Check your email</h3>
                  <p className="mb-4 text-sm text-gray-600">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="mb-6 text-xs text-gray-500">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setSuccess('');
                    }}
                    variant="outline"
                    className="mb-4"
                  >
                    Send another email
                  </Button>
                </div>
              )}

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-ash-teal hover:text-ash-teal/80 transition-colors duration-200"
                >
                  Remember your password? Sign in
                </Link>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-600">
              <Link to="/help" className="hover:text-ash-teal transition-colors duration-200">
                Help Center
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-ash-teal transition-colors duration-200">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-ash-teal transition-colors duration-200">
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Image and info */}
        <div className="hidden bg-gradient-to-br from-ash-teal to-ash-dark sm:block sm:w-1/2">
          <div className="flex h-full flex-col items-center justify-center px-8 text-white">
            <div className="mb-8 max-w-md animate-fade-in">
              <h1 className="mb-6 text-4xl font-bold">
                Secure Password Recovery
              </h1>
              <p className="mb-8 text-lg text-white/80">
                Reset your password securely and regain access to your account.
                Your security is our top priority.
              </p>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="mb-3 text-lg font-semibold">What happens next?</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start">
                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-ash-gold" />
                    We'll send a secure reset link to your email
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-ash-gold" />
                    Click the link to create a new password
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-ash-gold" />
                    Your account will be secured with the new password
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-auto pb-6 text-center text-sm text-white/60">
              © 2025 AfroScholarHub. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
