
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Phone } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on mount
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem loading your session. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user || null);
      setIsLoading(false);
    };

    getSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Account created successfully",
      description: "Please check your email for confirmation.",
    });
    
    navigate('/');
    setIsLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }

    toast({
      title: "Welcome back!",
      description: "You've successfully signed in.",
    });
    
    navigate('/');
    setIsLoading(false);
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
    
    // No need to navigate here as OAuth will redirect
    setIsLoading(false);
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        title: "Apple Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
    
    // No need to navigate here as OAuth will redirect
    setIsLoading(false);
  };

  const signInWithPhone = async (phone: string) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      toast({
        title: "Phone Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }

    toast({
      title: "Verification code sent",
      description: "Please check your phone for the verification code.",
    });
    
    setIsLoading(false);
  };

  const verifyOtp = async (phone: string, token: string) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }

    toast({
      title: "Phone verified successfully",
      description: "You've been signed in.",
    });
    
    navigate('/');
    setIsLoading(false);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signInWithPhone,
        verifyOtp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
