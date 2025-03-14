
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Trophy } from 'lucide-react';

interface UpcomingMatchesProps {
  location: string;
}

const UpcomingMatches = ({ location }: UpcomingMatchesProps) => {
  // Mock data for upcoming matches
  const matches = [
    {
      id: 1,
      sportType: 'Football',
      title: 'Sunday Football Match',
      location: 'Mumbai',
      venue: 'Azad Maidan, Fort',
      date: 'Sun, Aug 13, 2023',
      time: '4:00 PM',
      slots: { filled: 8, total: 10 },
      skillLevel: 'Intermediate',
      host: 'Rahul S.',
    },
    {
      id: 2,
      sportType: 'Cricket',
      title: 'T20 Evening Match',
      location: 'Mumbai',
      venue: 'Shivaji Park, Dadar',
      date: 'Sat, Aug 12, 2023',
      time: '5:30 PM',
      slots: { filled: 15, total: 22 },
      skillLevel: 'Advanced',
      host: 'Priya K.',
    },
    {
      id: 3,
      sportType: 'Basketball',
      title: 'Weekend Basketball',
      location: 'Mumbai',
      venue: 'YMCA, Bandra',
      date: 'Sat, Aug 12, 2023',
      time: '6:00 PM',
      slots: { filled: 6, total: 10 },
      skillLevel: 'Beginner',
      host: 'Vikram R.',
    },
    {
      id: 4,
      sportType: 'Tennis',
      title: 'Doubles Tennis Match',
      location: 'Mumbai',
      venue: 'CCI Courts, Churchgate',
      date: 'Mon, Aug 14, 2023',
      time: '7:00 AM',
      slots: { filled: 3, total: 4 },
      skillLevel: 'Intermediate',
      host: 'Anjali M.',
    },
    {
      id: 5,
      sportType: 'Badminton',
      title: 'Morning Badminton Session',
      location: 'Hyderabad',
      venue: 'Gachibowli Stadium',
      date: 'Sun, Aug 13, 2023',
      time: '8:00 AM',
      slots: { filled: 2, total: 4 },
      skillLevel: 'Intermediate',
      host: 'Kiran T.',
    },
  ];

  // Filter matches by location
  const filteredMatches = matches.filter(match => match.location === location);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredMatches.map((match) => (
        <Link to={`/matches/${match.id}`} key={match.id}>
          <Card className="sportyfi-card h-full hover:border-sportyfi-orange transition-colors overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-sportyfi-orange text-white flex justify-between items-center">
                <h3 className="font-bold">{match.sportType}</h3>
                <Badge className="bg-white text-sportyfi-orange">{match.skillLevel}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-3">{match.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-sportyfi-orange" />
                    <span>{match.venue}</span>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 text-sportyfi-orange" />
                    <span>{match.date} • {match.time}</span>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-4 w-4 mr-2 mt-0.5 text-sportyfi-orange" />
                    <span>
                      {match.slots.filled}/{match.slots.total} players joined
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Trophy className="h-4 w-4 mr-2 mt-0.5 text-sportyfi-orange" />
                    <span>Hosted by {match.host}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-3 text-center">
                {match.slots.filled === match.slots.total ? (
                  <span className="text-gray-500 font-medium">Match Full</span>
                ) : (
                  <span className="text-sportyfi-orange font-medium">Join Match</span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default UpcomingMatches;
