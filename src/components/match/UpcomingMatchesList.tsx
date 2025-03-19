
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Match {
  id: string;
  sport: string;
  location: string;
  match_time: string;
  team_size: number;
  available_slots: number;
}

interface UpcomingMatchesListProps {
  matches: Match[];
  isLoading?: boolean;
}

const UpcomingMatchesList = ({ matches, isLoading = false }: UpcomingMatchesListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            You have no upcoming matches. Join a match to see it here!
          </p>
          <div className="text-center">
            <Button asChild>
              <Link to="/matches">Find Matches</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => {
            const matchDate = new Date(match.match_time);
            const isToday = new Date().toDateString() === matchDate.toDateString();
            const formattedDate = isToday 
              ? 'Today' 
              : matchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const formattedTime = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={match.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{match.sport} Match</h3>
                  <Badge>{match.team_size}v{match.team_size}</Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{match.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{formattedTime}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/matches/${match.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchesList;
