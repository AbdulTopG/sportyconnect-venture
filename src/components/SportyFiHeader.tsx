
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, LogIn } from 'lucide-react';

const SportyFiHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = false; // Replace with actual auth state

  const navigationLinks = [
    { title: 'Home', path: '/' },
    { title: 'Matches', path: '/matches' },
    { title: 'Tournaments', path: '/tournaments' },
    { title: 'Leaderboards', path: '/leaderboards' },
    { title: 'About', path: '/about' },
  ];

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
                className="text-gray-700 hover:text-sportyfi-orange font-medium transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="outline" className="flex items-center space-x-2">
                  <User size={18} />
                  <span>Profile</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/signup">
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
                        className="text-foreground hover:text-sportyfi-orange font-medium transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.title}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto border-t py-4 space-y-4">
                    {isAuthenticated ? (
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
                    ) : (
                      <>
                        <Link
                          to="/login"
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
                          to="/signup"
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
