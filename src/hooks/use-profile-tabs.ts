
import { useState, useEffect } from 'react';
import { useProfileData } from '@/hooks/use-profile-data';

export const useProfileTabs = () => {
  // Set a default value to ensure it's never undefined
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { profile, refreshProfileData, loading } = useProfileData();

  const handleSaveProfile = () => {
    refreshProfileData();
    setActiveTab('dashboard');
  };

  // For debugging
  useEffect(() => {
    console.log("useProfileTabs activeTab:", activeTab);
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    profile,
    loading,
    handleSaveProfile
  };
};
