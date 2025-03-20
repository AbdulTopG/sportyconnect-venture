
import { useState } from 'react';
import { useProfileData } from '@/hooks/use-profile-data';

export const useProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, refreshProfileData, loading } = useProfileData();

  const handleSaveProfile = () => {
    refreshProfileData();
    setActiveTab('dashboard');
  };

  return {
    activeTab,
    setActiveTab,
    profile,
    loading,
    handleSaveProfile
  };
};
