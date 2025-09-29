import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { LoadingSpinner } from './LoadingSpinner';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash or search params
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login');
          return;
        }

        if (data.session?.user) {
          // Get user metadata to determine redirect
          const user = data.session.user;
          const role = user.user_metadata?.role || 'ambassador';
          const countryCode = user.user_metadata?.country_code;

          // Redirect based on role
          if (role === 'management') {
            navigate('/dashboard/management');
          } else if (role === 'country-lead' && countryCode) {
            navigate(`/dashboard/country-lead/${countryCode}`);
          } else if (role === 'ambassador') {
            if (countryCode) {
              navigate(`/dashboard/ambassador/${countryCode}`);
            } else {
              // New ambassador from Google sign-in, needs to select country
              navigate('/signup?step=country-selection');
            }
          } else if (role === 'support') {
            navigate('/dashboard/support');
          } else {
            // Default to ambassador dashboard
            navigate('/dashboard/ambassador');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth callback failed:', err);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

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
