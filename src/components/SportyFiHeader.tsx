import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Menu, LogOut, User, Settings, Trophy, Calendar, MapPin, PlayCircle } from 'lucide-react';
import { SafeSlot } from '@/components/ui/safe-slot';

const SportyFiHeader = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-md" : "bg-transparent"
    )}>
      <div className="sportyfi-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/a9c9c9a9-c9c9-49c9-9c9c-c9c9c9c9c9c9.png" 
            alt="SportyFi Logo" 
            className="h-10 w-auto" 
          />
          <span className={cn(
            "ml-2 text-xl font-bold transition-colors duration-300",
            isScrolled ? "text-sportyfi-black" : "text-white"
          )}>
            SportyFi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/matches" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isScrolled ? "text-sportyfi-black" : "text-white",
                      location.pathname === '/matches' && "bg-accent/50"
                    )}
                  >
                    Matches
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/tournaments" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isScrolled ? "text-sportyfi-black" : "text-white",
                      location.pathname === '/tournaments' && "bg-accent/50"
                    )}
                  >
                    Tournaments
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/venues" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isScrolled ? "text-sportyfi-black" : "text-white",
                      location.pathname === '/venues' && "bg-accent/50"
                    )}
                  >
                    Venues
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/leaderboards" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isScrolled ? "text-sportyfi-black" : "text-white",
                      location.pathname === '/leaderboards' && "bg-accent/50"
                    )}
                  >
                    Leaderboards
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    isScrolled ? "text-sportyfi-black" : "text-white"
                  )}
                >
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/watch" 
                          className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                        >
                          <PlayCircle size={16} className="text-red-500" />
                          <span>Watch Matches</span>
                          <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Live</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/about" 
                          className="block rounded-md p-2 hover:bg-accent"
                        >
                          About Us
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link 
                          to="/contact" 
                          className="block rounded-md p-2 hover:bg-accent"
                        >
                          Contact
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Menu or Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                    <AvatarFallback className="bg-sportyfi-orange text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.username || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bookings" className="flex items-center cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button 
                  variant={isScrolled ? "outline" : "ghost"} 
                  className={cn(
                    !isScrolled && "text-white hover:text-white hover:bg-white/20"
                  )}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button 
                  className={cn(
                    "bg-sportyfi-orange hover:bg-sportyfi-orange/90 text-white"
                  )}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  !isScrolled && "text-white hover:text-white hover:bg-white/20"
                )}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>SportyFi</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <nav className="flex flex-col space-y-4">
                  <Link 
                    to="/matches" 
                    className="px-4 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Matches
                  </Link>
                  <Link 
                    to="/tournaments" 
                    className="px-4 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tournaments
                  </Link>
                  <Link 
                    to="/venues" 
                    className="px-4 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Venues
                  </Link>
                  <Link 
                    to="/leaderboards" 
                    className="px-4 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Leaderboards
                  </Link>
                  <Link 
                    to="/watch" 
                    className="px-4 py-2 rounded-md hover:bg-accent flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlayCircle size={16} className="text-red-500" />
                    Watch Matches
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Live</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className="px-4 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/contact" 
                    className="px-4 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>

                <div className="mt-8 space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center px-4 py-2">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                          <AvatarFallback className="bg-sportyfi-orange text-white">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile?.username || user.email}</p>
                        </div>
                      </div>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <Link 
                        to="/bookings" 
                        className="flex items-center px-4 py-2 rounded-md hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </Link>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 rounded-md hover:bg-accent text-left"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/auth" 
                        className="block w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link 
                        to="/auth?signup=true" 
                        className="block w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-sportyfi-orange hover:bg-sportyfi-orange/90 text-white">
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
    </header>
  );
};

export default SportyFiHeader;
