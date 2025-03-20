
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'joined' | 'played' | 'created' | 'won' | 'booked';
  description: string;
  timestamp: Date;
  metadata?: {
    matchId?: string;
    tournamentId?: string;
    venueId?: string;
  };
}

interface UserActivityFeedProps {
  userId: string;
}

const UserActivityFeed = ({ userId }: UserActivityFeedProps) => {
  // This would typically come from an API call
  const activities: Activity[] = [
    {
      id: '1',
      type: 'joined',
      description: 'Joined SportyFi',
      timestamp: new Date(2023, 2, 15),
    },
    {
      id: '2',
      type: 'played',
      description: 'Played a football match at Mumbai Football Arena',
      timestamp: new Date(2023, 3, 2),
      metadata: {
        matchId: '123',
      },
    },
    {
      id: '3',
      type: 'won',
      description: 'Won the weekend tournament at DY Patil Stadium',
      timestamp: new Date(2023, 3, 10),
      metadata: {
        tournamentId: '456',
      },
    },
    {
      id: '4',
      type: 'booked',
      description: 'Booked Cooperage Ground for a friendly match',
      timestamp: new Date(2023, 3, 15),
      metadata: {
        venueId: '789',
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Your recent activities on SportyFi</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities yet. Start playing and booking matches!
            </div>
          ) : (
            activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-4 py-2">
                  <Avatar className="mt-1">
                    <AvatarFallback>
                      {activity.type.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p>{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp)} ago
                    </p>
                  </div>
                </div>
                {index < activities.length - 1 && <Separator />}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityFeed;
