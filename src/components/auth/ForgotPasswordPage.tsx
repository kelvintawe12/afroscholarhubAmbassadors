import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, ArrowLeftIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };
  return <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Link to="/" className="flex items-end">
                <span className="text-4xl font-bold text-ash-teal">ASH</span>
                <span className="ml-2 text-xl font-medium text-ash-dark">
                  Nexus
                </span>
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>
          {error && <div className="mb-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>}
          {isSubmitted ? <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircleIcon size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>.
                The link will expire in 30 minutes.
              </p>
              <div className="mt-6">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-ash-teal hover:text-ash-teal/80">
                  <ArrowLeftIcon size={16} className="mr-1" />
                  Back to sign in
                </Link>
              </div>
            </div> : <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MailIcon size={16} className="text-gray-400" />
                  </div>
                  <input type="email" id="email" className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <Button type="submit" variant="secondary" fullWidth isLoading={isSubmitting}>
                Send reset link
              </Button>
              <div className="mt-4 text-center">
                <Link to="/" className="text-sm font-medium text-ash-teal hover:text-ash-teal/80">
                  Back to sign in
                </Link>
              </div>
            </form>}
        </div>
      </div>
    </div>;
};