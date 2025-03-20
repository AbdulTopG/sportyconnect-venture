
import React from 'react';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useProfileTabs } from '@/hooks/use-profile-tabs';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useProfileTabs();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // For debugging
  console.log("Profile page rendering with activeTab:", activeTab);

  return (
    <ProfileLayout>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </ProfileLayout>
  );
};

export default Profile;
