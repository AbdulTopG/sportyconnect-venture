
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/header/Logo';
import NavigationLinks from '@/components/header/NavigationLinks';
import AuthButtons from '@/components/header/AuthButtons';
import MobileMenu from '@/components/header/MobileMenu';

const SportyFiHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="sportyfi-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <NavigationLinks 
            className="hidden md:flex items-center space-x-8"
            linkClassName="text-foreground hover:text-sportyfi-orange font-medium transition-colors flex items-center gap-1"
          />

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons className="flex items-center space-x-4" />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default SportyFiHeader;
