
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, MapPin, Users, Trophy, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Placeholder tournament data - in a real app, fetch this from a database
  const tournament = {
    id,
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
    description: 'Join our annual summer basketball tournament! Open to teams of all skill levels. Games will be played in a round-robin format followed by elimination rounds. Referees provided.',
    organizer: {
      name: 'City Sports Association',
      contact: 'tournaments@citysports.org',
      phone: '(555) 123-4567'
    },
    schedule: [
      { date: '2023-08-10', time: '09:00 AM', stage: 'Group Stage - Day 1' },
      { date: '2023-08-11', time: '09:00 AM', stage: 'Group Stage - Day 2' },
      { date: '2023-08-12', time: '09:00 AM', stage: 'Quarter-finals' },
      { date: '2023-08-14', time: '02:00 PM', stage: 'Semi-finals' },
      { date: '2023-08-15', time: '07:00 PM', stage: 'Finals' },
    ],
    teams: [
      { id: 'team1', name: 'Riverside Rebels', members: 5, status: 'confirmed' },
      { id: 'team2', name: 'Downtown Dribblers', members: 5, status: 'confirmed' },
      { id: 'team3', name: 'Heights Hustlers', members: 5, status: 'confirmed' },
      { id: 'team4', name: 'Central City Slammers', members: 5, status: 'confirmed' },
      { id: 'team5', name: 'Westside Wolves', members: 5, status: 'pending' },
    ]
  };

  const handleRegister = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this tournament",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setIsRegistering(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRegistering(false);
      toast({
        title: "Registration submitted",
        description: "Your team has been registered for the tournament. Check your email for confirmation details.",
      });
    }, 1500);
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl">Tournament not found</p>
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
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{tournament.name}</h1>
                <p className="text-lg text-gray-600">{tournament.sport}</p>
              </div>
              <Badge className={
                tournament.status === 'registration' 
                  ? "bg-green-500" 
                  : tournament.status === 'ongoing'
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }>
                {tournament.status === 'registration' 
                  ? "Registration Open" 
                  : tournament.status === 'ongoing'
                  ? "Ongoing"
                  : "Completed"}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tournament Details */}
            <div className="lg:col-span-2">
              <div className="sportyfi-card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Tournament Dates</p>
                      <p className="text-gray-600">
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{tournament.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Teams</p>
                      <p className="text-gray-600">{tournament.teamSize} players per team, {tournament.teamsCount} teams total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Registration Deadline</p>
                      <p className="text-gray-600">{new Date(tournament.registrationDeadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Entry Fee</p>
                      <p className="text-gray-600">{tournament.entryFee}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Prizes</p>
                      <p className="text-gray-600">{tournament.prizes}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h2 className="text-lg font-semibold mb-2">About this tournament</h2>
                  <p className="text-gray-700">{tournament.description}</p>
                </div>
              </div>
              
              <Tabs defaultValue="schedule" className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="teams">Teams</TabsTrigger>
                </TabsList>
                
                <TabsContent value="schedule" className="sportyfi-card mt-2">
                  <h3 className="text-lg font-semibold mb-4">Tournament Schedule</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Stage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tournament.schedule.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>{item.time}</TableCell>
                          <TableCell>{item.stage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="teams" className="sportyfi-card mt-2">
                  <h3 className="text-lg font-semibold mb-4">Registered Teams</h3>
                  <div className="space-y-4">
                    {tournament.teams.map(team => (
                      <div key={team.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-gray-500">{team.members} members</p>
                          </div>
                        </div>
                        <Badge className={
                          team.status === 'confirmed' 
                            ? "bg-green-500" 
                            : "bg-yellow-500"
                        }>
                          {team.status === 'confirmed' ? "Confirmed" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Registration and Organizer Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sportyfi-card">
                <h2 className="text-lg font-semibold mb-4">Registration</h2>
                {tournament.status === 'registration' ? (
                  <div>
                    <p className="mb-4 text-gray-700">Register your team for this tournament. Entry fee: {tournament.entryFee}</p>
                    <Button 
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
                    >
                      {isRegistering ? "Processing..." : "Register Team"}
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      Registration closes on {new Date(tournament.registrationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    Registration is currently closed for this tournament.
                  </p>
                )}
              </div>
              
              <div className="sportyfi-card">
                <h2 className="text-lg font-semibold mb-4">Organizer Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {tournament.organizer.name}</p>
                  <p><span className="font-medium">Contact:</span> {tournament.organizer.contact}</p>
                  <p><span className="font-medium">Phone:</span> {tournament.organizer.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TournamentDetail;
