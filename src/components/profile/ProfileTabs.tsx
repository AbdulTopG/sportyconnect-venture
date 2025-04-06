
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlayerDashboard from '@/components/match/PlayerDashboard';
import ProfileEditForm from '@/components/match/ProfileEditForm';
import MatchesLoadingState from '@/components/match/MatchesLoadingState';
import { toast } from '@/hooks/use-toast';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  profile?: any;
  loading?: any;
  handleSaveProfile?: () => void;
}

const ProfileTabs = ({ activeTab, setActiveTab, profile, loading, handleSaveProfile }: ProfileTabsProps) => {
  // Add enhanced debugging information
  useEffect(() => {
    console.log('ProfileTabs rendering with:', { 
      activeTab, 
      profileLoaded: !!profile, 
      loading,
      handleSaveProfileDefined: !!handleSaveProfile
    });
  }, [activeTab, profile, loading, handleSaveProfile]);

  // Function to handle profile save with proper error handling
  const handleSave = () => {
    console.log('Profile save initiated');
    try {
      if (handleSaveProfile) {
        handleSaveProfile();
        console.log('handleSaveProfile executed successfully');
      } else {
        console.warn('No handleSaveProfile function provided');
        toast({
          title: "Warning",
          description: "Could not save profile changes properly. Please try again.",
          variant: "destructive",
        });
        // Switch back to dashboard tab as a fallback
        setActiveTab('dashboard');
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Error",
        description: "Failed to save profile changes. Please try again.",
        variant: "destructive",
      });
      // Ensure we still switch tabs even if there's an error
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
