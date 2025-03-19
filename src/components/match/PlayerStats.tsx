
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, UserCheck, Clock, Calendar, Flame, Award, Medal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
  detailed?: boolean;
}

const PlayerStats = ({ stats, isLoading = false, detailed = false }: PlayerStatsProps) => {
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
    
  const performancePercentage = Math.min(stats.performance_rating * 10, 100);

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
        
        {detailed && (
          <div className="mt-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Performance Rating</span>
                  <span className="text-sm font-medium">{stats.performance_rating.toFixed(1)}/10</span>
                </div>
                <Progress value={performancePercentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Win Rate</span>
                  <span className="text-sm font-medium">{winRate}%</span>
                </div>
                <Progress value={parseFloat(winRate)} className="h-2" />
              </div>
            </div>
          </div>
        )}
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700 flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-green-600" />
              Matches Won
            </span>
            <span className="font-medium">{stats.matches_won}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-700 flex items-center">
              <Award className="h-4 w-4 mr-2 text-red-500" />
              Matches Lost
            </span>
            <span className="font-medium">{stats.matches_lost}</span>
          </div>
          
          {detailed && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-700 flex items-center">
                  <Flame className="h-4 w-4 mr-2 text-orange-500" />
                  Goals per Match
                </span>
                <span className="font-medium">
                  {stats.matches_played > 0 
                    ? (stats.goals_scored / stats.matches_played).toFixed(1) 
                    : '0.0'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-700 flex items-center">
                  <Medal className="h-4 w-4 mr-2 text-blue-500" />
                  MVP Rate
                </span>
                <span className="font-medium">
                  {stats.matches_played > 0 
                    ? `${((stats.mvp_count / stats.matches_played) * 100).toFixed(1)}%` 
                    : '0.0%'}
                </span>
              </div>
            </>
          )}
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated
            </span>
            <span>{new Date(stats.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStats;
