
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateProfileCompleteness } from '@/lib/profile-utils';
import ProfileAvatarUpload from '@/components/profile/form/ProfileAvatarUpload';
import ProfileCompleteness from '@/components/profile/form/ProfileCompleteness';
import BasicProfileFields from '@/components/profile/form/BasicProfileFields';
import PreferredSportsSelector from '@/components/profile/form/PreferredSportsSelector';

interface ProfileEditFormProps {
  user: {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
    location?: string | null;
    bio?: string | null;
    primary_sport?: string | null;
    preferred_sports?: string[] | null;
  };
  onSave: () => void;
}

const AVAILABLE_SPORTS = [
  'Basketball', 'Football', 'Tennis', 'Cricket', 'Volleyball', 
  'Badminton', 'Baseball', 'Swimming', 'Running', 'Table Tennis',
  'Soccer', 'Golf', 'Hockey', 'Rugby', 'Boxing'
];

const ProfileEditForm = ({ user, onSave }: ProfileEditFormProps) => {
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [primarySport, setPrimarySport] = useState(user.primary_sport || '');
  const [preferredSports, setPreferredSports] = useState<string[]>(user.preferred_sports || []);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url || '');

  // Calculate initial profile completeness
  const initialCompleteness = calculateProfileCompleteness(user);
  
  // Calculate current profile completeness based on form state
  const currentCompleteness = calculateProfileCompleteness({
    username,
    bio,
    location,
    primary_sport: primarySport,
    avatar_url: avatarPreview,
    preferred_sports: preferredSports.length ? preferredSports : null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Update user profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          location,
          primary_sport: primarySport,
          preferred_sports: preferredSports.length ? preferredSports : null,
          avatar_url: avatarPreview || user.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      // Important: Call the onSave callback to update the parent component
      onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile completeness indicator */}
      <ProfileCompleteness 
        currentCompleteness={currentCompleteness} 
        initialCompleteness={initialCompleteness} 
      />
      
      {/* Avatar upload */}
      <ProfileAvatarUpload 
        userId={user.id} 
        avatarUrl={avatarPreview} 
        username={username} 
        onAvatarChange={setAvatarPreview} 
      />
      
      {/* Basic profile fields */}
      <BasicProfileFields 
        username={username}
        setUsername={setUsername}
        bio={bio}
        setBio={setBio}
        location={location}
        setLocation={setLocation}
        primarySport={primarySport}
        setPrimarySport={setPrimarySport}
        availableSports={AVAILABLE_SPORTS}
      />
      
      {/* Preferred sports selector */}
      <PreferredSportsSelector 
        preferredSports={preferredSports}
        setPreferredSports={setPreferredSports}
        availableSports={AVAILABLE_SPORTS}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-sportyfi-orange hover:bg-red-600" 
        disabled={isSaving}
      >
        {isSaving ? "Saving Changes..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileEditForm;
