
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlayerDashboard from '@/components/match/PlayerDashboard';
import ProfileEditForm from '@/components/match/ProfileEditForm';
import { useProfileTabs } from '@/hooks/use-profile-tabs';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const { profile, loading, handleSaveProfile } = useProfileTabs();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="w-full max-w-md mx-auto">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="edit">Edit Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <PlayerDashboard />
      </TabsContent>
      
      <TabsContent value="edit">
        <div className="max-w-2xl mx-auto">
          <div className="sportyfi-card">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
            
            {loading.profile ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-sportyfi-orange"></div>
              </div>
            ) : profile ? (
              <ProfileEditForm user={profile} onSave={handleSaveProfile} />
            ) : (
              <p className="text-center text-muted-foreground">Unable to load profile</p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
