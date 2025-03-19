
import React from 'react';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useProfileTabs } from '@/hooks/use-profile-tabs';

const Profile = () => {
  const { activeTab, setActiveTab } = useProfileTabs();

  return (
    <ProfileLayout>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </ProfileLayout>
  );
};

export default Profile;
