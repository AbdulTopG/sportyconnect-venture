
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the session from the URL (Supabase adds # parameters)
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error in auth callback:', error);
        navigate('/auth', { replace: true });
        return;
      }

      if (data?.session) {
        // Successfully authenticated
        navigate('/', { replace: true });
      } else {
        // No session found
        navigate('/auth', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium">Finalizing authentication...</h2>
        <p className="text-gray-500 mt-2">You'll be redirected shortly.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
