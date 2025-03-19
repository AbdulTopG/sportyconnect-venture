
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Medal } from 'lucide-react';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

interface PlayerAchievementsProps {
  achievements: Achievement[];
  isLoading?: boolean;
}

const getAchievementIcon = (iconName: string) => {
  switch(iconName) {
    case 'trophy':
      return <Trophy className="h-4 w-4" />;
    case 'star':
      return <Star className="h-4 w-4" />;
    case 'award':
      return <Award className="h-4 w-4" />;
    case 'medal':
      return <Medal className="h-4 w-4" />;
    default:
      return <Trophy className="h-4 w-4" />;
  }
};

const PlayerAchievements = ({ achievements, isLoading = false }: PlayerAchievementsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            No achievements unlocked yet. Keep playing to earn badges!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className="flex flex-col items-center p-3 bg-muted/40 rounded-lg text-center"
            >
              <div className="bg-sportyfi-orange h-10 w-10 rounded-full flex items-center justify-center mb-2 text-white">
                {getAchievementIcon(achievement.icon)}
              </div>
              <span className="font-medium text-sm">{achievement.achievement_name}</span>
              <span className="text-xs text-muted-foreground mt-1">{achievement.description}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerAchievements;
