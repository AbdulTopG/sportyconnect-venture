
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, UserCheck, Calendar } from 'lucide-react';

interface PlayerStatsProps {
  stats: {
    matches_played: number;
    matches_won: number;
    matches_lost: number;
    goals_scored: number;
    mvp_count: number;
    performance_rating: number;
    updated_at: string;
  };
  isLoading?: boolean;
}

const PlayerStats = ({ stats, isLoading = false }: PlayerStatsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const winRate = stats.matches_played > 0 
    ? ((stats.matches_won / stats.matches_played) * 100).toFixed(1) 
    : '0.0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className="text-2xl font-bold text-green-600">{winRate}%</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Matches</p>
            <p className="text-2xl font-bold">{stats.matches_played}</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Goals</p>
            <p className="text-2xl font-bold">{stats.goals_scored}</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">MVP Count</p>
            <p className="text-2xl font-bold">{stats.mvp_count}</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Matches Won</span>
            <span className="font-medium">{stats.matches_won}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-700">Matches Lost</span>
            <span className="font-medium">{stats.matches_lost}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-700">Performance Rating</span>
            <span className="font-medium">{stats.performance_rating.toFixed(1)}</span>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last Updated</span>
            <span>{new Date(stats.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStats;
