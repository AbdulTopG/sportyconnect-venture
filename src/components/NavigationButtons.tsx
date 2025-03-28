
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useLocation } from 'react-router-dom';

const NavigationButtons = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define the navigation paths in order
  const navigationPaths = ['/', '/matches', '/tournaments', '/watch', '/venues', '/leaderboards', '/about', '/contact'];
  
  // Find current index in the navigation paths
  const currentIndex = navigationPaths.indexOf(currentPath);
  
  // Determine previous and next paths
  const prevPath = currentIndex > 0 ? navigationPaths[currentIndex - 1] : null;
  const nextPath = currentIndex < navigationPaths.length - 1 ? navigationPaths[currentIndex + 1] : null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center gap-4">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        {prevPath && (
          <Link to={prevPath}>
            <Button size="icon" variant="outline" className="rounded-full hover:bg-slate-100">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
          </Link>
        )}
        
        <Link to="/">
          <Button size="icon" variant="outline" className="rounded-full hover:bg-slate-100">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
        
        {nextPath && (
          <Link to={nextPath}>
            <Button size="icon" variant="outline" className="rounded-full hover:bg-slate-100">
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;
