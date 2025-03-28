
import React from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import NavigationButtons from '@/components/NavigationButtons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const Tournaments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Placeholder tournaments data
  const tournaments = [
    {
      id: '1',
      name: 'Summer Basketball Championship',
      sport: 'Basketball',
      startDate: '2023-08-10',
      endDate: '2023-08-15',
      location: 'City Sports Arena',
      teamSize: 5,
      teamsCount: 16,
      registrationDeadline: '2023-07-25',
      entryFee: '$50 per team',
      status: 'registration',
      prizes: 'Trophy + $1000',
    },
    {
      id: '2',
      name: 'Regional Soccer League',
      sport: 'Soccer',
      startDate: '2023-09-05',
      endDate: '2023-10-20',
      location: 'Municipal Stadium',
      teamSize: 11,
      teamsCount: 12,
      registrationDeadline: '2023-08-15',
      entryFee: '$100 per team',
      status: 'registration',
      prizes: 'Trophy + $2000',
    },
    {
      id: '3',
      name: 'Spring Tennis Cup',
      sport: 'Tennis',
      startDate: '2023-04-10',
      endDate: '2023-04-12',
      location: 'Central Tennis Club',
      teamSize: 2,
      teamsCount: 32,
      registrationDeadline: '2023-03-20',
      entryFee: '$30 per team',
      status: 'completed',
      prizes: 'Trophy + $500',
    },
  ];

  const handleRegister = (tournamentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for tournaments",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // In a real app, you would make an API call to register the user
    toast({
      title: "Registration submitted",
      description: "Your tournament registration has been submitted.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Tournaments</h1>
          
          <div className="grid grid-cols-1 gap-6">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="sportyfi-card">
                <div className="md:flex justify-between">
                  <div className="md:w-3/4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{tournament.name}</h2>
                        <p className="text-gray-600 mb-2">{tournament.sport}</p>
                      </div>
                      <Badge className={tournament.status === 'registration' 
                        ? "bg-green-500" 
                        : tournament.status === 'ongoing'
                        ? "bg-blue-500"
                        : "bg-gray-500"}>
                        {tournament.status === 'registration' 
                          ? "Registration Open" 
                          : tournament.status === 'ongoing'
                          ? "Ongoing"
                          : "Completed"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-4">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{tournament.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{tournament.teamSize} players per team, {tournament.teamsCount} teams</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Prize: {tournament.prizes}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm">
                        <span className="font-medium">Registration deadline:</span> {new Date(tournament.registrationDeadline).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Entry fee:</span> {tournament.entryFee}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 flex flex-col justify-center items-center mt-4 md:mt-0 md:border-l md:pl-6">
                    <Button 
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      className="w-full mb-2"
                      variant="outline"
                    >
                      View Details
                    </Button>
                    
                    {tournament.status === 'registration' && (
                      <Button 
                        onClick={() => handleRegister(tournament.id)}
                        className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <NavigationButtons />
    </div>
  );
};

export default Tournaments;
