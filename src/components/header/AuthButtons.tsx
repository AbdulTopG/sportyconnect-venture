
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface AuthButtonsProps {
  onSignOut?: () => void;
  className?: string;
  isMobile?: boolean;
}

const AuthButtons = ({ onSignOut, className = "", isMobile = false }: AuthButtonsProps) => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You've been logged out of your account.",
      });
      if (onSignOut) onSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign Out Failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      {isAuthenticated ? (
        <>
          <Link
            to="/profile"
            className={isMobile ? "w-full" : ""}
            onClick={onSignOut}
          >
            <Button
              variant="outline"
              className={`flex items-center justify-center space-x-2 ${isMobile ? 'w-full' : ''}`}
            >
              <User size={18} />
              <span>Profile</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            className={`flex items-center justify-center space-x-2 ${isMobile ? 'w-full' : ''}`}
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </>
      ) : (
        <>
          <Link
            to="/auth"
            className={isMobile ? "w-full" : ""}
            onClick={onSignOut}
          >
            <Button
              variant="outline"
              className={`flex items-center justify-center space-x-2 ${isMobile ? 'w-full' : ''}`}
            >
              <LogIn size={18} />
              <span>Login</span>
            </Button>
          </Link>
          <Link
            to="/auth?tab=signup"
            className={isMobile ? "w-full" : ""}
            onClick={onSignOut}
          >
            <Button className={`bg-sportyfi-orange hover:bg-red-600 text-white ${isMobile ? 'w-full' : ''}`}>
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
