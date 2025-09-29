import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockIcon, MailIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { useAuth } from '../contexts/AuthContext';
export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [statsVisible, setStatsVisible] = useState([false, false, false, false]);
  // Trigger animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  // Animate stats one by one
  useEffect(() => {
    if (animateStats) {
      const timers = statsVisible.map((_, index) => {
        return setTimeout(() => {
          setStatsVisible(prev => {
            const newStats = [...prev];
            newStats[index] = true;
            return newStats;
          });
        }, 300 * (index + 1));
      });
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [animateStats]);
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
        setLoginAttempts(prev => prev + 1);
        if (loginAttempts >= 2) {
          setError('Too many failed attempts. Please try again later or reset your password.');
        } else {
          setError(signInError.message || 'Invalid email or password. Please try again.');
        }
      } else if (signedInUser) {
        setSuccess('Authentication successful!');
        // Navigation will be handled by AuthContext based on user role and country_code
        // The AuthContext should redirect automatically after successful login
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="flex min-h-screen w-full flex-col">
      {/* Left side - Login form */}
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
            {error && <div className="mb-6 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700 animate-slide-up">
                <AlertTriangleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>}
            {success && <div className="mb-6 flex items-start rounded-md border-l-4 border-green-500 bg-green-50 p-3 text-sm text-green-700 animate-slide-up">
                <CheckCircleIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{success}</p>
              </div>}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-fade-in">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              </div>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MailIcon size={16} className="text-gray-400" />
                    </div>
                    <input type="email" className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal transition-all duration-300" placeholder="Enter your work email" value={email} onChange={e => setEmail(e.target.value)} required />
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
                    <input type={showPassword ? 'text' : 'password'} className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal transition-all duration-300" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button type="button" className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Checkbox label="Remember me" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                  <Link to="/forgot-password" className="text-sm font-medium text-ash-teal hover:text-ash-teal/80 transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" variant="secondary" fullWidth isLoading={isLoading} className="transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  Sign In
                </Button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/signup" className="text-sm font-medium text-ash-teal hover:text-ash-teal/80 transition-colors duration-200">
                  Don't have an account? Sign up
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
                Empowering Ambassadors Across Africa
              </h1>
              <p className="mb-8 text-lg text-white/80">
                Connect with schools, track partnerships, and make a difference
                in students' lives with our all-in-one platform.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-lg bg-white/10 p-4 backdrop-blur-sm transform transition-all duration-500 ${statsVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h3 className="text-xl font-bold text-ash-gold">
                    <span className="inline-block">45</span>
                    <span className="inline-block animate-pulse-slow">+</span>
                  </h3>
                  <p className="text-sm text-white/80">School Partnerships</p>
                </div>
                <div className={`rounded-lg bg-white/10 p-4 backdrop-blur-sm transform transition-all duration-500 ${statsVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h3 className="text-xl font-bold text-ash-gold">
                    <span className="inline-block">1,200</span>
                    <span className="inline-block animate-pulse-slow">+</span>
                  </h3>
                  <p className="text-sm text-white/80">Students Reached</p>
                </div>
                <div className={`rounded-lg bg-white/10 p-4 backdrop-blur-sm transform transition-all duration-500 ${statsVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h3 className="text-xl font-bold text-ash-gold">4</h3>
                  <p className="text-sm text-white/80">African Countries</p>
                </div>
                <div className={`rounded-lg bg-white/10 p-4 backdrop-blur-sm transform transition-all duration-500 ${statsVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <h3 className="text-xl font-bold text-ash-gold">
                    <span className="inline-block">52</span>
                  </h3>
                  <p className="text-sm text-white/80">Active Ambassadors</p>
                </div>
              </div>
            </div>
            <div className="mt-auto pb-6 text-center text-sm text-white/60">
              © 2025 AfroScholarHub. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>;
};
