
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  
  // Placeholder match data - in a real app, fetch this from a database
  const match = {
    id,
    sport: 'Basketball',
    location: 'Central Park Courts',
    date: '2023-07-15T18:00:00',
    teamSize: 5,
    availableSlots: 3,
    description: 'Casual basketball game, all skill levels welcome! We play for fun but still competitive.',
    host: {
      id: 'host123',
      name: 'Alex Johnson',
      avatar: '',
    },
    participants: [
      { id: 'user1', name: 'Michael Scott', avatar: '' },
      { id: 'user2', name: 'Sara Williams', avatar: '' },
    ]
  };

  const handleJoinMatch = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join this match",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setIsJoining(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false);
      toast({
        title: "Success!",
        description: "You've joined the match. See you there!",
      });
      // In a real implementation, you would refresh data here
    }, 1000);
  };

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl">Match not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Match Details */}
            <div className="lg:col-span-2 sportyfi-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{match.sport} Match</h1>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(match.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <Badge className="bg-green-500">
                  {match.availableSlots} spots left
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">About this match</h2>
                <p className="text-gray-700">{match.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 mr-2" />
                  <h2 className="text-lg font-semibold">Team Size: {match.teamSize} players</h2>
                </div>
                <p className="text-gray-700">
                  {match.teamSize - match.availableSlots} joined, {match.availableSlots} spots remaining
                </p>
              </div>
              
              <Button 
                onClick={handleJoinMatch}
                disabled={isJoining || match.availableSlots === 0}
                className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
              >
                {isJoining ? "Joining..." : match.availableSlots === 0 ? "Match Full" : "Join This Match"}
              </Button>
            </div>
            
            {/* Host and Participants */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sportyfi-card">
                <h2 className="text-lg font-semibold mb-4">Host</h2>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={match.host.avatar} />
                    <AvatarFallback>{match.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{match.host.name}</p>
                    <p className="text-sm text-gray-500">Host</p>
                  </div>
                </div>
              </div>
              
              <div className="sportyfi-card">
                <h2 className="text-lg font-semibold mb-4">Participants</h2>
                {match.participants.length > 0 ? (
                  <div className="space-y-3">
                    {match.participants.map(participant => (
                      <div key={participant.id} className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{participant.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No participants have joined yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchDetail;
