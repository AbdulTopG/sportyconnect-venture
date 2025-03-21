
import React, { useState, useEffect } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar, MapPin, Users, Loader2, PlayCircle, Search, Filter, Clock, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, Match } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const Matches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showFull, setShowFull] = useState(true);
  
  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);

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
  }, [selectedSport]);

  // Apply filters to matches whenever filter criteria change
  useEffect(() => {
    let result = [...matches];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(match => 
        match.sport.toLowerCase().includes(term) || 
        match.location.toLowerCase().includes(term) || 
        (match.description && match.description.toLowerCase().includes(term))
      );
    }
    
    // Apply skill level filter
    if (skillLevel) {
      result = result.filter(match => match.skill_level === skillLevel);
    }
    
    // Apply time filter
    if (timeFilter) {
      const now = new Date();
      if (timeFilter === 'today') {
        // Filter for matches happening today
        result = result.filter(match => {
          const matchDate = new Date(match.match_time);
          return matchDate.getDate() === now.getDate() && 
                 matchDate.getMonth() === now.getMonth() && 
                 matchDate.getFullYear() === now.getFullYear();
        });
      } else if (timeFilter === 'this-week') {
        // Filter for matches happening this week
        const weekFromNow = new Date();
        weekFromNow.setDate(now.getDate() + 7);
        result = result.filter(match => {
          const matchDate = new Date(match.match_time);
          return matchDate >= now && matchDate <= weekFromNow;
        });
      } else if (timeFilter === 'weekend') {
        // Filter for matches happening this weekend
        const startOfWeekend = new Date();
        const daysUntilSaturday = (6 - now.getDay() + 7) % 7; // 6 = Saturday
        startOfWeekend.setDate(now.getDate() + daysUntilSaturday);
        startOfWeekend.setHours(0, 0, 0, 0);
        
        const endOfWeekend = new Date(startOfWeekend);
        endOfWeekend.setDate(startOfWeekend.getDate() + 1); // Sunday
        endOfWeekend.setHours(23, 59, 59, 999);
        
        result = result.filter(match => {
          const matchDate = new Date(match.match_time);
          return matchDate >= startOfWeekend && matchDate <= endOfWeekend;
        });
      }
    }
    
    // Filter out full matches if needed
    if (!showFull) {
      result = result.filter(match => match.available_slots > 0);
    }
    
    setFilteredMatches(result);
  }, [matches, searchTerm, skillLevel, timeFilter, showFull]);

  // Set up real-time subscription to matches
  useEffect(() => {
    if (isSubscribed) return;
    
    // Subscribe to changes in the matches table
    const channel = supabase
      .channel('matches-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'matches' 
      }, (payload) => {
        console.log('Change received!', payload);
        
        if (payload.eventType === 'INSERT') {
          // Add new match to the list
          setMatches(prevMatches => [...prevMatches, payload.new as Match]);
        } else if (payload.eventType === 'UPDATE') {
          // Update the existing match
          setMatches(prevMatches => prevMatches.map(match => 
            match.id === payload.new.id ? payload.new as Match : match
          ));
        } else if (payload.eventType === 'DELETE') {
          // Remove the match from the list
          setMatches(prevMatches => prevMatches.filter(match => match.id !== payload.old.id));
        }
      })
      .subscribe();
    
    setIsSubscribed(true);
    
    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [matches, isSubscribed]);

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
    setSearchTerm('');
    setSkillLevel(null);
    setTimeFilter(null);
    setShowFull(true);
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

  // Toggle advanced filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
          
          {/* New search and advanced filter section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by location, sport, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline" 
                onClick={toggleFilters}
                className="md:w-auto flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="showFull" 
                  checked={showFull} 
                  onCheckedChange={(checked) => setShowFull(checked as boolean)}
                />
                <Label htmlFor="showFull" className="text-sm cursor-pointer">Show full matches</Label>
              </div>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <Label className="block mb-2 text-sm font-medium">Skill Level</Label>
                  <Select 
                    value={skillLevel || ''} 
                    onValueChange={(value) => setSkillLevel(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All skill levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All skill levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all">All levels welcome</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block mb-2 text-sm font-medium">Time Frame</Label>
                  <ToggleGroup type="single" value={timeFilter || ''} onValueChange={(value) => setTimeFilter(value || null)}>
                    <ToggleGroupItem value="today" className="text-xs">Today</ToggleGroupItem>
                    <ToggleGroupItem value="this-week" className="text-xs">This Week</ToggleGroupItem>
                    <ToggleGroupItem value="weekend" className="text-xs">Weekend</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={clearFilter} 
                    className="text-gray-600"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
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
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">
                {selectedSport 
                  ? `No matches found for ${selectedSport}` 
                  : "No matches found"}
              </h2>
              <p className="mb-6">Try selecting a different sport or adjusting your filters!</p>
              {(selectedSport || searchTerm || skillLevel || timeFilter) && 
                <Button onClick={clearFilter} className="mr-4">Clear All Filters</Button>
              }
              <Button onClick={handleCreateMatch} className="bg-sportyfi-orange hover:bg-red-600">Host a Match</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <div key={match.id} className="sportyfi-card hover:shadow-md transition-shadow relative">
                  {/* Time indicator */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(match.match_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-start mb-3 mt-2">
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
                      <MapPin className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{match.location}</span>
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                      {new Date(match.match_time).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                      {match.team_size} players ({match.skill_level})
                    </p>
                    
                    {/* New: Slots filled indicator */}
                    <div className="pt-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Spots filled</span>
                        <span>{match.team_size - match.available_slots}/{match.team_size}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-sportyfi-orange rounded-full h-1.5" 
                          style={{ width: `${((match.team_size - match.available_slots) / match.team_size) * 100}%` }}
                        ></div>
                      </div>
                    </div>
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
