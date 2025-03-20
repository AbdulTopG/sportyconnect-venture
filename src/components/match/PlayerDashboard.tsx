
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, User, Calendar, Activity, Settings } from 'lucide-react';
import ProfileHeader from '@/components/match/ProfileHeader';
import PlayerStats from './PlayerStats';
import PlayerAchievements from './PlayerAchievements';
import UpcomingMatchesList from './UpcomingMatchesList';
import UserActivityFeed from '@/components/profile/UserActivityFeed';
import { useProfileData } from '@/hooks/use-profile-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const PlayerDashboard = () => {
  const { 
    profile, 
    playerStats, 
    achievements, 
    upcomingMatches,
    loading,
    refreshProfileData
  } = useProfileData();
  
  const isMobile = useIsMobile();

  if (loading.profile) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-sportyfi-orange"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="mb-6 bg-muted/50 border-muted">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Stats and achievements are automatically updated based on your participation in matches and cannot be manually edited.
        </AlertDescription>
      </Alert>
      
      <div className="md:flex md:space-x-6">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <ProfileHeader user={profile} isEditable={true} />
          
          {!isMobile && (
            <div className="mt-6">
              <UserActivityFeed />
            </div>
          )}
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">
                <Activity className="h-4 w-4 mr-2 md:mr-0" />
                <span className="hidden md:inline ml-2">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">
                <Trophy className="h-4 w-4 mr-2 md:mr-0" />
                <span className="hidden md:inline ml-2">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1">
                <User className="h-4 w-4 mr-2 md:mr-0" />
                <span className="hidden md:inline ml-2">Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex-1">
                <Calendar className="h-4 w-4 mr-2 md:mr-0" />
                <span className="hidden md:inline ml-2">Upcoming</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              {isMobile && <UserActivityFeed />}
              
              <PlayerStats 
                stats={playerStats || {
                  matches_played: 0,
                  matches_won: 0,
                  matches_lost: 0,
                  goals_scored: 0,
                  mvp_count: 0,
                  performance_rating: 0,
                  updated_at: new Date().toISOString()
                }} 
                isLoading={loading.stats}
              />
              
              <UpcomingMatchesList 
                matches={upcomingMatches?.slice(0, 2) || []} 
                isLoading={loading.matches}
              />
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6">
              <PlayerStats 
                stats={playerStats || {
                  matches_played: 0,
                  matches_won: 0,
                  matches_lost: 0,
                  goals_scored: 0,
                  mvp_count: 0,
                  performance_rating: 0,
                  updated_at: new Date().toISOString()
                }} 
                isLoading={loading.stats}
                detailed={true}
              />
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <PlayerAchievements 
                achievements={achievements || []} 
                isLoading={loading.achievements}
              />
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-6">
              <UpcomingMatchesList 
                matches={upcomingMatches || []} 
                isLoading={loading.matches}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
