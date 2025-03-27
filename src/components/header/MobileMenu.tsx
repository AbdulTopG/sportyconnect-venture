
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import NavigationLinks from './NavigationLinks';
import AuthButtons from './AuthButtons';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
            <NavigationLinks 
              className="flex flex-col space-y-4 py-6"
              linkClassName="text-foreground hover:text-sportyfi-orange font-medium transition-colors py-2 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            />
            <div className="mt-auto border-t py-4 space-y-4">
              {/* ThemeToggle has been removed */}
              <AuthButtons 
                className="space-y-4" 
                isMobile={true} 
                onSignOut={() => setIsOpen(false)} 
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
