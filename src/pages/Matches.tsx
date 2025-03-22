import React, { useState, useEffect } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar, MapPin, Users, Loader2, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, Match } from '@/integrations/supabase/client';

const Matches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract sport from URL query parameters when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sportParam = queryParams.get('sport');
    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [location.search]);

  // Fetch matches from Supabase
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase.from('matches').select('*');
        
        // Apply sport filter if selected
        if (selectedSport) {
          query = query.eq('sport', selectedSport);
        }
        
        // Sort by match time, most recent first
        query = query.order('match_time', { ascending: true });
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching matches:", error);
          setError("Failed to load matches. Please try again.");
          return;
        }
        
        console.log("Matches fetched:", data);
        setMatches(data || []);
      } catch (err) {
        console.error("Unexpected error fetching matches:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
    
    // Set up real-time subscription to matches
    const matchesChannel = supabase
      .channel('public:matches')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'matches' }, 
        (payload) => {
          console.log('New match created:', payload);
          const newMatch = payload.new as Match;
          
          // Only add the match if it matches the current filter
          if (!selectedSport || newMatch.sport === selectedSport) {
            setMatches(currentMatches => {
              // Check if the match already exists in our list
              if (currentMatches.some(match => match.id === newMatch.id)) {
                return currentMatches;
              }
              // Add the new match and re-sort
              const updatedMatches = [...currentMatches, newMatch];
              return updatedMatches.sort((a, b) => 
                new Date(a.match_time).getTime() - new Date(b.match_time).getTime()
              );
            });
            
            // Show a toast notification for newly created matches
            if (newMatch.host_id !== user?.id) {
              toast({
                title: "New Match Created",
                description: `A new ${newMatch.sport} match has been added.`,
              });
            }
          }
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(matchesChannel);
    };
  }, [selectedSport, user?.id]);

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

  // Extract unique sports from the matches for filtering
  const allSports = Array.from(new Set(matches.map(match => match.sport)));

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

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'} mb-6`}>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {selectedSport 
                  ? `${selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} Matches` 
                  : 'Available Matches'}
              </h1>
              {selectedSport && !isMobile && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilter}
                    className="text-sportyfi-orange border-sportyfi-orange"
                  >
                    Clear Filter
                  </Button>
                </div>
              )}
            </div>

            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
              <div className="w-full md:w-48">
                <Select 
                  value={selectedSport || 'all'} 
                  onValueChange={handleSportChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    {allSports.map(sport => (
                      <SelectItem key={sport} value={sport}>
                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading matches...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4 text-red-600">{error}</h2>
              <Button onClick={() => window.location.reload()} className="mr-4">Try Again</Button>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">
                {selectedSport 
                  ? `No matches found for ${selectedSport}` 
                  : "No matches found"}
              </h2>
              <p className="mb-6">Try selecting a different sport or host a match yourself!</p>
              {selectedSport && <Button onClick={clearFilter} className="mr-4">View All Matches</Button>}
              <Button onClick={handleCreateMatch} className="bg-sportyfi-orange hover:bg-red-600">Host a Match</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div key={match.id} className="sportyfi-card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">
                      {match.sport.charAt(0).toUpperCase() + match.sport.slice(1)}
                    </h3>
                    <div className="flex gap-2">
                      {Math.random() > 0.7 && (
                        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          Live
                        </Badge>
                      )}
                      <Badge className={`${match.available_slots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
                        {match.available_slots > 0 ? `${match.available_slots} spots left` : 'Full'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {match.location}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {new Date(match.match_time).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      {match.team_size} players ({match.skill_level})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {Math.random() > 0.7 && (
                      <Button 
                        onClick={handleWatchMatches}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Watch Live
                      </Button>
                    )}
                    <Button 
                      onClick={() => navigate(`/matches/${match.id}`)}
                      className="flex-1 bg-sportyfi-orange hover:bg-red-600 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Matches;
