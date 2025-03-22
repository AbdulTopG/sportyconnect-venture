
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Define the shape of our auth context
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null; // Using any for profile data
  signIn: (email?: string, password?: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  signInWithPhone: async () => {},
  verifyOtp: async () => {},
  isLoading: true,
});

// Export a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      
      // Fetch profile data from users table if we have a user
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Set up a listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        // Update profile when auth state changes
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email?: string, password?: string) => {
    if (!email || !password) {
      // Handle social login case
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    
    toast({
      title: "Sign Up Successful",
      description: "Please check your email for verification.",
    });
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.error("Error signing in with Apple:", error);
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true,
      }
    });
    
    if (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Phone Authentication Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Verification Code Sent",
      description: "Please check your phone for the verification code.",
    });
  };

  const verifyOtp = async (phone: string, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms'
    });
    
    if (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    signInWithPhone,
    verifyOtp,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
