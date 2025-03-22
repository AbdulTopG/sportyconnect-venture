
import React, { useEffect, useState } from 'react';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useProfileTabs } from '@/hooks/use-profile-tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProfileHeader from '@/components/profile/ProfileHeader';
import MatchesLoadingState from '@/components/match/MatchesLoadingState';

const Profile = () => {
  const { activeTab, setActiveTab, profile, loading, handleSaveProfile } = useProfileTabs();
  const [error, setError] = useState<Error | null>(null);

  // Error boundary effect
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Profile page error:", error);
      setError(error.error);
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <ProfileLayout>
        <Alert variant="destructive">
          <AlertDescription>
            An error occurred while loading your profile. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </ProfileLayout>
    );
  }

  // Show loading state while profile is loading
  if (loading.profile && !profile) {
    return (
      <ProfileLayout>
        <MatchesLoadingState message="Loading profile..." />
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      {profile && !loading.profile && (
        <ProfileHeader user={profile} isEditable={true} />
      )}
      <div className="mt-6">
        <ProfileTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          profile={profile} 
          loading={loading} 
          handleSaveProfile={handleSaveProfile} 
        />
      </div>
    </ProfileLayout>
  );
};

export default Profile;
