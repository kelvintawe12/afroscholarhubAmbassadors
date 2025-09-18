import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockIcon, EyeIcon, EyeOffIcon, CheckCircleIcon, AlertTriangleIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '../ui/Button';
export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Redirect to login after success
      setTimeout(() => {
        navigate('/');
      }, 3000);
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
              Create new password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your new password must be different from previous passwords.
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
                Password reset successful
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your password has been reset successfully. You will be
                redirected to the login page.
              </p>
              <div className="mt-6">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-ash-teal hover:text-ash-teal/80">
                  <ArrowLeftIcon size={16} className="mr-1" />
                  Back to sign in
                </Link>
              </div>
            </div> : <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  New password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockIcon size={16} className="text-gray-400" />
                  </div>
                  <input type={showPassword ? 'text' : 'password'} id="password" className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button type="button" className="text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockIcon size={16} className="text-gray-400" />
                  </div>
                  <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button type="button" className="text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <Button type="submit" variant="secondary" fullWidth isLoading={isSubmitting}>
                Reset password
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