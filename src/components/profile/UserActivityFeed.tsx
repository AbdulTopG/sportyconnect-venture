
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Trophy, Target, User } from 'lucide-react';
import { useProfileData } from '@/hooks/use-profile-data';

const UserActivityFeed = () => {
  const { profile, playerStats, achievements, loading } = useProfileData();
  
  if (loading.profile || loading.stats || loading.achievements) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return null;
  }
  
  // Get recent achievements (last 3)
  const recentAchievements = achievements
    ? achievements.slice(0, 3)
    : [];
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAchievements.length > 0 ? (
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="bg-sportyfi-orange h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0">
                  <Trophy className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{achievement.achievement_name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No recent activity to show
          </div>
        )}
        
        {playerStats && (
          <div className="flex flex-col space-y-2 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium">Performance Summary</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Target className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Matches played:</span>
                <span className="ml-auto font-medium">{playerStats.matches_played}</span>
              </div>
              
              <div className="flex items-center">
                <Trophy className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Win rate:</span>
                <span className="ml-auto font-medium">
                  {playerStats.matches_played > 0 
                    ? `${((playerStats.matches_won / playerStats.matches_played) * 100).toFixed(1)}%` 
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityFeed;
