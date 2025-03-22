
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { PlayCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MatchesHeaderProps {
  title: string;
  selectedSport: string | null;
  onClearFilter: () => void;
}

const MatchesHeader: React.FC<MatchesHeaderProps> = ({ 
  title, 
  selectedSport, 
  onClearFilter 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleCreateMatch = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a match",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    navigate('/matches/create');
  };

  const handleWatchMatches = () => {
    navigate('/watch');
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'} mb-6`}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {selectedSport && !isMobile && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilter}
              className="text-sportyfi-orange border-sportyfi-orange"
            >
              Clear Filter
            </Button>
          </div>
        )}
      </div>

      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            onClick={handleWatchMatches}
            variant="outline"
            className="flex-1 md:flex-auto flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Matches
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">Live</span>
          </Button>
          
          <Button 
            onClick={handleCreateMatch}
            className="flex-1 md:flex-auto bg-sportyfi-orange hover:bg-red-600 text-white"
          >
            Host a Match
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchesHeader;
