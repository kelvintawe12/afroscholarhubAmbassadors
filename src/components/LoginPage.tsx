import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockIcon, MailIcon, ShieldIcon, ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { RoleSelector } from './RoleSelector';
// Demo accounts for quick testing
const DEMO_ACCOUNTS = [{
  email: 'coo@afroscholarhub.org',
  password: 'demo123',
  roles: ['management', 'ambassador']
}, {
  email: 'aisha.lead@afroscholarhub.org',
  password: 'demo123',
  role: 'country-lead',
  country: 'ng'
}, {
  email: 'john.amb@afroscholarhub.org',
  password: 'demo123',
  role: 'ambassador'
}];
export const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [userName, setUserName] = useState('');
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    // Simulate API call with demo accounts
    setTimeout(() => {
      setIsLoading(false);
      const account = DEMO_ACCOUNTS.find(account => account.email.toLowerCase() === email.toLowerCase() && account.password === password);
      if (account) {
        setSuccess('Authentication successful!');
        setUserName(email.split('@')[0]);
        // If user has multiple roles, show role selector
        if (Array.isArray(account.roles) && account.roles.length > 1) {
          setTimeout(() => {
            setShowRoleSelector(true);
          }, 800);
        } else {
          // Single role, redirect directly
          const role = Array.isArray(account.roles) ? account.roles[0] : account.role;
          const countryPath = account.country ? `/${account.country}` : '';
          setTimeout(() => {
            // Actually navigate to the dashboard
            navigate(`/dashboard/${role}${countryPath}`);
          }, 800);
        }
      } else {
        setLoginAttempts(prev => prev + 1);
        if (loginAttempts >= 2) {
          setError('Too many failed attempts. Please try again later or reset your password.');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      }
    }, 1000);
  };
  const handleSelectRole = (path: string) => {
    setShowRoleSelector(false);
    // Actually navigate to the dashboard
    setTimeout(() => {
      navigate(path);
    }, 500);
  };
  const setDemoCredentials = (type: string) => {
    const account = DEMO_ACCOUNTS.find(acc => {
      if (type === 'management') return acc.email === 'coo@afroscholarhub.org';
      if (type === 'country_lead') return acc.email === 'aisha.lead@afroscholarhub.org';
      if (type === 'ambassador') return acc.email === 'john.amb@afroscholarhub.org';
      return false;
    });
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
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
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Demo Accounts
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button onClick={() => setDemoCredentials('management')} className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 transition-all duration-200 hover:border-ash-teal/50">
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ash-gold/20 text-ash-gold">
                        <InfoIcon size={14} />
                      </div>
                      <span className="ml-2 font-medium">Management</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      coo@afroscholarhub.org
                    </span>
                  </button>
                  <button onClick={() => setDemoCredentials('country_lead')} className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 transition-all duration-200 hover:border-ash-teal/50">
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/20 text-ash-teal">
                        <InfoIcon size={14} />
                      </div>
                      <span className="ml-2 font-medium">Country Lead</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      aisha.lead@afroscholarhub.org
                    </span>
                  </button>
                  <button onClick={() => setDemoCredentials('ambassador')} className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 transition-all duration-200 hover:border-ash-teal/50">
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <InfoIcon size={14} />
                      </div>
                      <span className="ml-2 font-medium">Ambassador</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      john.amb@afroscholarhub.org
                    </span>
                  </button>
                </div>
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
      {/* Role selector modal */}
      <RoleSelector isOpen={showRoleSelector} onClose={() => setShowRoleSelector(false)} onSelectRole={handleSelectRole} userName={userName} />
    </div>;
};