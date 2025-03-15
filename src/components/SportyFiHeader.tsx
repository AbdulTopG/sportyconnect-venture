
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, LogIn, LogOut, Map, PlayCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const SportyFiHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  const navigationLinks = [
    { title: 'Home', path: '/' },
    { title: 'Matches', path: '/matches' },
    { title: 'Tournaments', path: '/tournaments' },
    { title: 'Watch Matches', path: '/watch', icon: <PlayCircle size={18} className="text-red-500" /> },
    { title: 'Grounds Booking', path: '/venues' },
    { title: 'Leaderboards', path: '/leaderboards' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You've been logged out of your account.",
      });
      setIsOpen(false);
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
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="sportyfi-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-sportyfi-orange">Sporty</span>Fi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="text-gray-700 hover:text-sportyfi-orange font-medium transition-colors flex items-center gap-1"
              >
                {link.icon && link.icon}
                {link.title}
                {link.title === 'Watch Matches' && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Live</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User size={18} />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={handleSignOut}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/auth?tab=signup">
                  <Button className="bg-sportyfi-orange hover:bg-red-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <span className="text-xl font-bold">
                      <span className="text-sportyfi-orange">Sporty</span>Fi
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-4 py-6">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.title}
                        to={link.path}
                        className="text-foreground hover:text-sportyfi-orange font-medium transition-colors py-2 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon && link.icon}
                        {link.title}
                        {link.title === 'Watch Matches' && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Live</span>
                        )}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto border-t py-4 space-y-4">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center space-x-2"
                          >
                            <User size={18} />
                            <span>Profile</span>
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center space-x-2"
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
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center space-x-2"
                          >
                            <LogIn size={18} />
                            <span>Login</span>
                          </Button>
                        </Link>
                        <Link
                          to="/auth?tab=signup"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full bg-sportyfi-orange hover:bg-red-600 text-white">
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SportyFiHeader;
