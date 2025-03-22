
import { useState, useEffect } from 'react';
import { supabase, Match } from '@/integrations/supabase/client';

export const useMatches = (initialSport: string | null = null) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(initialSport);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);
  const [showFull, setShowFull] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
      result = result.filter(match => {
        // Check if the skill_level property exists and matches the filter
        // Convert 'all-levels' filter to 'all' value in the database if needed
        const filterValue = skillLevel === 'all-levels' ? 'all' : skillLevel;
        return match.skill_level === filterValue;
      });
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

  // Compute all unique sports from the matches
  const allSports = Array.from(new Set(matches.map(match => match.sport)));

  // Reset all filters
  const clearFilter = () => {
    setSelectedSport(null);
    setSearchTerm('');
    setSkillLevel(null);
    setTimeFilter(null);
    setShowFull(true);
  };

  // Toggle advanced filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
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
    setShowFilters,
    allSports,
    clearFilter,
    toggleFilters
  };
};
