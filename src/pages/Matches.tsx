
import React, { useState, useEffect } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const Matches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // Extract sport from URL query parameters when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sportParam = queryParams.get('sport');
    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [location.search]);

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

  // Placeholder matches data
  const allMatches = [
    {
      id: '1',
      sport: 'basketball',
      location: 'Central Park Courts',
      date: '2023-07-15T18:00:00',
      teamSize: 5,
      availableSlots: 3,
    },
    {
      id: '2',
      sport: 'football',
      location: 'Riverside Fields',
      date: '2023-07-16T17:30:00',
      teamSize: 11,
      availableSlots: 5,
    },
    {
      id: '3',
      sport: 'tennis',
      location: 'Metro Tennis Club',
      date: '2023-07-14T09:00:00',
      teamSize: 2,
      availableSlots: 1,
    },
    {
      id: '4',
      sport: 'cricket',
      location: 'Cricket Ground',
      date: '2023-07-18T14:00:00',
      teamSize: 11,
      availableSlots: 3,
    },
    {
      id: '5',
      sport: 'volleyball',
      location: 'Beach Courts',
      date: '2023-07-19T16:00:00',
      teamSize: 6,
      availableSlots: 2,
    },
    {
      id: '6',
      sport: 'table tennis',
      location: 'Community Center',
      date: '2023-07-20T18:30:00',
      teamSize: 2,
      availableSlots: 1,
    },
  ];

  // Filter matches based on selected sport
  const filteredMatches = selectedSport 
    ? allMatches.filter(match => match.sport === selectedSport.toLowerCase())
    : allMatches;

  const clearFilter = () => {
    setSelectedSport(null);
    navigate('/matches');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {selectedSport 
                  ? `${selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} Matches` 
                  : 'Available Matches'}
              </h1>
              {selectedSport && (
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
            <Button 
              onClick={handleCreateMatch}
              className="bg-sportyfi-orange hover:bg-red-600 text-white"
            >
              Host a Match
            </Button>
          </div>
          
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">No matches found for {selectedSport}</h2>
              <p className="mb-6">Try selecting a different sport or host a match yourself!</p>
              <Button onClick={clearFilter} className="mr-4">View All Matches</Button>
              <Button onClick={handleCreateMatch} className="bg-sportyfi-orange hover:bg-red-600">Host a Match</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <div key={match.id} className="sportyfi-card">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">
                      {match.sport.charAt(0).toUpperCase() + match.sport.slice(1)}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {match.availableSlots} spots left
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Location:</span> {match.location}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Date:</span> {new Date(match.date).toLocaleString()}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Team Size:</span> {match.teamSize} players
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/matches/${match.id}`)}
                    className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
                  >
                    View Details
                  </Button>
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
