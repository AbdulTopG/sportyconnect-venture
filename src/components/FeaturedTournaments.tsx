
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';

const FeaturedTournaments = () => {
  // Mock data for upcoming tournaments
  const tournaments = [
    {
      id: 1,
      title: 'SportyFi Premier League',
      sportType: 'Football',
      banner: '/tournament-football.jpg',
      location: 'Mumbai',
      venue: 'DY Patil Stadium',
      startDate: 'Sep 15, 2023',
      endDate: 'Sep 30, 2023',
      registrationDeadline: 'Sep 10, 2023',
      prize: '₹1,00,000',
      teams: { registered: 12, total: 16 },
      status: 'Registering',
    },
    {
      id: 2,
      title: 'SportyFi Cricket Cup',
      sportType: 'Cricket',
      banner: '/tournament-cricket.jpg',
      location: 'Delhi',
      venue: 'Feroz Shah Kotla Ground',
      startDate: 'Oct 5, 2023',
      endDate: 'Oct 20, 2023',
      registrationDeadline: 'Sep 25, 2023',
      prize: '₹2,00,000',
      teams: { registered: 8, total: 10 },
      status: 'Registering',
    },
    {
      id: 3,
      title: 'Basketball Championship',
      sportType: 'Basketball',
      banner: '/tournament-basketball.jpg',
      location: 'Bangalore',
      venue: 'Kanteerava Indoor Stadium',
      startDate: 'Nov 10, 2023',
      endDate: 'Nov 15, 2023',
      registrationDeadline: 'Oct 30, 2023',
      prize: '₹75,000',
      teams: { registered: 6, total: 8 },
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <Link to={`/tournaments/${tournament.id}`} key={tournament.id}>
          <Card className="sportyfi-card h-full bg-sportyfi-darkGray text-white hover:ring-2 hover:ring-sportyfi-orange transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-sportyfi-black relative">
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="font-bold text-xl">{tournament.title}</h3>
                  <Badge className="mt-2 bg-sportyfi-orange">{tournament.sportType}</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-sportyfi-orange" />
                    <span className="font-semibold">Prize: {tournament.prize}</span>
                  </div>
                  <Badge 
                    className={
                      tournament.status === 'Registering' 
                        ? 'bg-green-500' 
                        : 'bg-yellow-500'
                    }
                  >
                    {tournament.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-sportyfi-orange" />
                    <span>{tournament.venue}, {tournament.location}</span>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 text-sportyfi-orange" />
                    <span>{tournament.startDate} - {tournament.endDate}</span>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-4 w-4 mr-2 mt-0.5 text-sportyfi-orange" />
                    <span>
                      {tournament.teams.registered}/{tournament.teams.total} teams registered
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-sportyfi-orange p-3 text-center font-semibold">
                {tournament.status === 'Registering' ? 'Register Now' : 'View Details'}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedTournaments;
