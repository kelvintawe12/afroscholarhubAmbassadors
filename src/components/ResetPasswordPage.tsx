import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LockIcon, AlertTriangleIcon, CheckCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../utils/supabase';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if we have the required tokens in URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      setError('Invalid or expired reset link. Please request a new password reset.');
    } else {
      // Set the session with the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError('Please enter a new password');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to update password. Please try again.');
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
              <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
                Set new password
              </h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal transition-all duration-300"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal transition-all duration-300"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  fullWidth
                  isLoading={isLoading}
                  className="transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Update Password
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-ash-teal hover:text-ash-teal/80 transition-colors duration-200"
                >
                  Back to sign in
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-600">
              <a href="/help" className="hover:text-ash-teal transition-colors duration-200">
                Help Center
              </a>
              <span>•</span>
              <a href="/privacy" className="hover:text-ash-teal transition-colors duration-200">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-ash-teal transition-colors duration-200">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Right side - Image and info */}
        <div className="hidden bg-gradient-to-br from-ash-teal to-ash-dark sm:block sm:w-1/2">
          <div className="flex h-full flex-col items-center justify-center px-8 text-white">
            <div className="mb-8 max-w-md animate-fade-in">
              <h1 className="mb-6 text-4xl font-bold">
                Secure Password Update
              </h1>
              <p className="mb-8 text-lg text-white/80">
                Create a strong, secure password for your account.
                Your security is our top priority.
              </p>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="mb-3 text-lg font-semibold">Password Requirements</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start">
                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-ash-gold" />
                    At least 8 characters long
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-ash-gold" />
                    Mix of uppercase and lowercase letters
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-ash-gold" />
                    Include numbers and special characters
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-ash-gold" />
                    Different from your previous password
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
