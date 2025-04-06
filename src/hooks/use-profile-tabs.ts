
import { useState, useCallback } from 'react';
import { useProfileData } from '@/hooks/use-profile-data';
import { toast } from '@/hooks/use-toast';

export const useProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, refreshProfileData, loading } = useProfileData();

  const handleSaveProfile = useCallback(() => {
    console.log('handleSaveProfile called in useProfileTabs');
    try {
      // First switch the tab to avoid UI issues
      setActiveTab('dashboard');
      
      // Then refresh the profile data
      refreshProfileData()
        .then(() => {
          console.log('Profile data refreshed successfully');
        })
        .catch((error) => {
          console.error('Error refreshing profile data:', error);
          toast({
            title: "Refresh error",
            description: "Your profile was saved but we couldn't refresh the data",
            variant: "destructive",
          });
        });
    } catch (error) {
      console.error('Error in handleSaveProfile:', error);
      // Still switch tabs even if there's an error
      setActiveTab('dashboard');
    }
  }, [refreshProfileData]);

  return {
    activeTab,
    setActiveTab,
    profile,
    loading,
    handleSaveProfile
  };
};
