
import React from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const upcomingMatches = [
    {
      id: '1',
      sport: 'Basketball',
      location: 'Central Park Courts',
      date: '2023-07-15T18:00:00',
      teamSize: 5,
      availableSlots: 3,
    },
    {
      id: '2',
      sport: 'Soccer',
      location: 'Riverside Fields',
      date: '2023-07-16T17:30:00',
      teamSize: 11,
      availableSlots: 5,
    },
    {
      id: '3',
      sport: 'Tennis',
      location: 'Metro Tennis Club',
      date: '2023-07-14T09:00:00',
      teamSize: 2,
      availableSlots: 1,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Available Matches</h1>
            <Button 
              onClick={handleCreateMatch}
              className="bg-sportyfi-orange hover:bg-red-600 text-white"
            >
              Host a Match
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="sportyfi-card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{match.sport}</h3>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Matches;
