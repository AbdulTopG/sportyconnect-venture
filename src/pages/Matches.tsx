
import React, { useState, useEffect } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import NavigationButtons from '@/components/NavigationButtons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMatches } from '@/hooks/use-matches';
import MatchesHeader from '@/components/match/MatchesHeader';
import SportFilter from '@/components/match/SportFilter';
import MatchesList from '@/components/match/MatchesList';
import MatchesLoadingState from '@/components/match/MatchesLoadingState';
import MatchesErrorState from '@/components/match/MatchesErrorState';
import MatchesEmptyState from '@/components/match/MatchesEmptyState';

const Matches = () => {
  console.log("Rendering Matches page");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Extract sport from URL query parameters when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sportParam = queryParams.get('sport');
    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [location.search]);

  // Use the hook to fetch and manage matches
  const { matches, isLoading, error, isInitialLoad } = useMatches(selectedSport);

  console.log("Matches component state:", { 
    isLoading, 
    error, 
    matchesCount: matches?.length || 0,
    isInitialLoad
  });

  // Extract unique sports from the matches for filtering
  const allSports = matches && Array.isArray(matches) && matches.length > 0 
    ? Array.from(new Set(matches.map(match => match.sport))) 
    : [];

  const clearFilter = () => {
    setSelectedSport(null);
    navigate('/matches');
  };

  const handleSportChange = (sport: string) => {
    if (sport === 'all') {
      clearFilter();
    } else {
      setSelectedSport(sport);
      navigate(`/matches?sport=${sport}`);
    }
  };

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

  const getPageTitle = () => {
    return selectedSport 
      ? `${selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} Matches` 
      : 'Available Matches';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <MatchesHeader 
                title={getPageTitle()} 
                selectedSport={selectedSport} 
                onClearFilter={clearFilter} 
              />
              
              <SportFilter 
                selectedSport={selectedSport} 
                allSports={allSports} 
                onSportChange={handleSportChange} 
              />
            </div>
            
            {isLoading ? (
              <MatchesLoadingState isInitialLoad={isInitialLoad} />
            ) : error ? (
              <MatchesErrorState 
                error={error} 
                onRetry={() => window.location.reload()} 
              />
            ) : !matches || !Array.isArray(matches) || matches.length === 0 ? (
              <MatchesEmptyState 
                selectedSport={selectedSport} 
                onClearFilter={clearFilter} 
                onCreateMatch={handleCreateMatch} 
              />
            ) : (
              <MatchesList matches={matches} />
            )}
          </div>
        </div>
      </main>
      
      <NavigationButtons />
    </div>
  );
};

export default Matches;
