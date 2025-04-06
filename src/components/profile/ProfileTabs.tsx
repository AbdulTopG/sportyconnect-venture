
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlayerDashboard from '@/components/match/PlayerDashboard';
import ProfileEditForm from '@/components/match/ProfileEditForm';
import MatchesLoadingState from '@/components/match/MatchesLoadingState';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  profile?: any;
  loading?: any;
  handleSaveProfile?: () => void;
}

const ProfileTabs = ({ activeTab, setActiveTab, profile, loading, handleSaveProfile }: ProfileTabsProps) => {
  // Add debugging information
  useEffect(() => {
    console.log('ProfileTabs rendering with:', { 
      activeTab, 
      profileLoaded: !!profile, 
      loading 
    });
  }, [activeTab, profile, loading]);

  // Function to handle profile save with proper fallback
  const handleSave = () => {
    if (handleSaveProfile) {
      handleSaveProfile();
    } else {
      console.log('No handleSaveProfile function provided');
      // Switch back to dashboard tab as a fallback
      setActiveTab('dashboard');
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="w-full max-w-md mx-auto">
        <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
        <TabsTrigger value="edit" className="flex-1">Edit Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <PlayerDashboard />
      </TabsContent>
      
      <TabsContent value="edit">
        <div className="max-w-2xl mx-auto">
          <div className="sportyfi-card">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
            
            {loading?.profile ? (
              <MatchesLoadingState message="Loading profile data..." />
            ) : profile ? (
              <ProfileEditForm user={profile} onSave={handleSave} />
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
