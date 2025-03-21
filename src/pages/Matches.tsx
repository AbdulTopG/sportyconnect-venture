
import React, { useEffect } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useMatches } from '@/hooks/use-matches';
import MatchesHeader from '@/components/match/MatchesHeader';
import MatchesFilter from '@/components/match/MatchesFilter';
import MatchesGrid from '@/components/match/MatchesGrid';

const Matches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Extract initial sport from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialSport = queryParams.get('sport');
  
  // Use custom hook for matches data and filtering
  const { 
    matches,
    filteredMatches,
    isLoading,
    error,
    selectedSport,
    setSelectedSport,
    searchTerm,
    setSearchTerm,
    skillLevel,
    setSkillLevel,
    timeFilter,
    setTimeFilter,
    showFull,
    setShowFull,
    showFilters,
    allSports,
    clearFilter,
    toggleFilters
  } = useMatches(initialSport);
  
  // Update URL when sport filter changes
  useEffect(() => {
    if (selectedSport) {
      navigate(`/matches?sport=${selectedSport}`);
    } else {
      navigate('/matches');
    }
  }, [selectedSport, navigate]);

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

  const handleSportChange = (sport: string) => {
    if (sport === 'all') {
      clearFilter();
    } else {
      setSelectedSport(sport);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          {/* Header section with title and main actions */}
          <MatchesHeader 
            selectedSport={selectedSport}
            allSports={allSports}
            onSportChange={handleSportChange}
            onWatchMatches={handleWatchMatches}
            onCreateMatch={handleCreateMatch}
            onClearFilter={clearFilter}
          />
          
          {/* Search and filters section */}
          <MatchesFilter 
            searchTerm={searchTerm}
            skillLevel={skillLevel}
            timeFilter={timeFilter}
            showFull={showFull}
            showFilters={showFilters}
            onSearchChange={setSearchTerm}
            onSkillLevelChange={setSkillLevel}
            onTimeFilterChange={setTimeFilter}
            onShowFullChange={setShowFull}
            onToggleFilters={toggleFilters}
            onClearFilter={clearFilter}
          />
          
          {/* Matches grid section */}
          <MatchesGrid 
            matches={matches}
            filteredMatches={filteredMatches}
            isLoading={isLoading}
            error={error}
            selectedSport={selectedSport}
            onWatchMatches={handleWatchMatches}
            onCreateMatch={handleCreateMatch}
            onClearFilter={clearFilter}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Matches;
