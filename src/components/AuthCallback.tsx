import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { ensureUserInDatabase } from '../api/auth';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('AuthCallback: loading=', loading, 'user=', user);
      if (!loading) {
        if (user) {
          const role = user.role || 'ambassador';
          const countryCode = user.country_code;
          const fullName = user.full_name;

          console.log('AuthCallback: role=', role, 'countryCode=', countryCode, 'fullName=', fullName);

          const needsProfileCompletion = !fullName || !role || !countryCode;

          if (needsProfileCompletion) {
            console.log('AuthCallback: redirecting to profile completion');
            navigate('/signup?step=profile-completion');
            return;
          }

          // Ensure user exists in database before redirecting to dashboard
          try {
            console.log('AuthCallback: ensuring user exists in database');
            await ensureUserInDatabase(user);
          } catch (error) {
            console.error('AuthCallback: failed to sync user to database:', error);
            // Continue with redirect even if database sync fails
          }

          if (role === 'management') {
            console.log('AuthCallback: redirecting to management dashboard');
            navigate('/dashboard/management');
          } else if (role === 'country_lead' && countryCode) {
            console.log('AuthCallback: redirecting to country lead dashboard');
            navigate(`/dashboard/country-lead/${countryCode}`);
          } else if (role === 'ambassador') {
            console.log('AuthCallback: redirecting to ambassador dashboard');
            navigate('/dashboard/ambassador');
          } else if (role === 'support') {
            console.log('AuthCallback: redirecting to support dashboard');
            navigate('/dashboard/support');
          } else {
            console.log('AuthCallback: redirecting to default ambassador dashboard');
            navigate('/dashboard/ambassador');
          }
        } else {
          console.log('AuthCallback: no user, redirecting to login');
          navigate('/login');
        }
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
