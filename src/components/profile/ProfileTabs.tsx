
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserActivityFeed from './UserActivityFeed';
import PlayerStats from '@/components/match/PlayerStats';
import UpcomingMatchesList from '@/components/match/UpcomingMatchesList';
import PlayerAchievements from '@/components/match/PlayerAchievements';
import ProfileEditForm from '@/components/match/ProfileEditForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type ProfileTab = 'activity' | 'stats' | 'matches' | 'achievements' | 'edit';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  // Mock stats data in case we don't have actual data yet
  const mockStats = {
    matches_played: 0,
    matches_won: 0,
    matches_lost: 0,
    goals_scored: 0,
    mvp_count: 0,
    performance_rating: 0,
    updated_at: new Date().toISOString()
  };

  const handleProfileSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully",
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProfileTab)} className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="edit">Edit Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="activity" className="mt-6">
        <UserActivityFeed userId={user.id} />
      </TabsContent>
      
      <TabsContent value="stats" className="mt-6">
        <PlayerStats stats={mockStats} isLoading={false} />
      </TabsContent>
      
      <TabsContent value="matches" className="mt-6">
        <UpcomingMatchesList matches={[]} isLoading={false} />
      </TabsContent>
      
      <TabsContent value="achievements" className="mt-6">
        <PlayerAchievements achievements={[]} isLoading={false} />
      </TabsContent>
      
      <TabsContent value="edit" className="mt-6">
        <ProfileEditForm user={user} onSave={handleProfileSave} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
