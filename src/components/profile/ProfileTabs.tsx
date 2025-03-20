
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserActivityFeed from './UserActivityFeed';
import PlayerStats from '@/components/match/PlayerStats';
import UpcomingMatchesList from '@/components/match/UpcomingMatchesList';
import PlayerAchievements from '@/components/match/PlayerAchievements';
import ProfileEditForm from '@/components/match/ProfileEditForm';
import { useAuth } from '@/context/AuthContext';

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
        <PlayerStats userId={user.id} />
      </TabsContent>
      
      <TabsContent value="matches" className="mt-6">
        <UpcomingMatchesList userId={user.id} />
      </TabsContent>
      
      <TabsContent value="achievements" className="mt-6">
        <PlayerAchievements userId={user.id} />
      </TabsContent>
      
      <TabsContent value="edit" className="mt-6">
        <ProfileEditForm user={user} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
