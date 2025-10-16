import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthCallback() {
  const { oauthLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const bootstrap = async () => {
      if (token) {
        try {
          // Use oauthLogin to properly set authentication state
          const success = oauthLogin(token);
          if (success) {
            navigate('/');
          } else {
            console.error('Failed to process OAuth token');
            navigate('/login');
          }
        } catch (e) {
          console.error('OAuth callback error:', e);
          navigate('/login');
        }
      } else {
        console.error('No token received from OAuth provider');
        navigate('/login');
      }
    };
    bootstrap();
  }, [location, navigate, oauthLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Completing sign in...</div>
    </div>
  );
}


