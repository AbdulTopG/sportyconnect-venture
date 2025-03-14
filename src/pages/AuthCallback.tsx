
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL (Supabase adds # parameters)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error in auth callback:', error);
          setError(error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          setTimeout(() => navigate('/auth', { replace: true }), 2000);
          return;
        }

        if (data?.session) {
          // Successfully authenticated
          console.log('Auth callback successful, session found');
          
          // Check if user profile exists, create if not
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error checking user profile:', profileError);
          }
          
          // If profile doesn't exist, create one
          if (!profileData) {
            // Extract username from email (part before @)
            const username = data.session.user.email?.split('@')[0] || null;
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ 
                id: data.session.user.id,
                username: username,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
              
            if (insertError) {
              console.error('Error creating user profile:', insertError);
            }
          }
          
          toast({
            title: "Authentication Successful",
            description: "You've been signed in successfully.",
          });
          navigate('/', { replace: true });
        } else {
          // No session found
          console.error('No session found in auth callback');
          setError('No session found. Please try signing in again.');
          setTimeout(() => navigate('/auth', { replace: true }), 2000);
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError('An unexpected error occurred');
        setTimeout(() => navigate('/auth', { replace: true }), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (!isLoading && !error) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {isLoading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-medium">Finalizing authentication...</h2>
            <p className="text-gray-500 mt-2">You'll be redirected shortly.</p>
          </>
        ) : error ? (
          <>
            <h2 className="text-xl font-medium text-red-600">Authentication Error</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <p className="text-gray-500 mt-2">Redirecting to login page...</p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AuthCallback;
