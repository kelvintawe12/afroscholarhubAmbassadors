import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, MailIcon, AlertTriangleIcon, CheckCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';

export const ReauthPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    try {
      const { user: signedInUser, error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message || 'Reauthentication failed. Please try again.');
      } else if (signedInUser) {
        setSuccess('Reauthentication successful!');
        // Redirect back to login or dashboard
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError('Reauthentication failed. Please try again.');
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
                Reauthenticate to continue
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
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                Reauthenticate
              </h2>
              <p className="mb-6 text-center text-sm text-gray-600">
                Please enter your password to continue.
              </p>
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
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal transition-all duration-300"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                <Button
                  type="submit"
                  variant="secondary"
                  fullWidth
                  isLoading={isLoading}
                  className="transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Reauthenticate
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-ash-teal hover:text-ash-teal/80 transition-colors duration-200"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden bg-gradient-to-br from-ash-teal to-ash-dark sm:block sm:w-1/2">
          <div className="flex h-full flex-col items-center justify-center px-8 text-white">
            <div className="mb-8 max-w-md animate-fade-in">
              <h1 className="mb-6 text-4xl font-bold">
                Secure Access
              </h1>
              <p className="mb-8 text-lg text-white/80">
                Reauthenticate to ensure your account security and continue accessing your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
