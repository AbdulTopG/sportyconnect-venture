
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Image, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { calculateProfileCompleteness } from '@/lib/profile-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
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
  const [uploading, setUploading] = useState(false);
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
  
  // Show improvement if current > initial
  const showImprovement = currentCompleteness.completeness > initialCompleteness.completeness;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handlePrimarySportChange = (value: string) => {
    setPrimarySport(value);
  };

  const handlePreferredSportsChange = (value: string[]) => {
    setPreferredSports(value);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Avatar image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a JPEG or PNG image",
        variant: "destructive",
      });
      return;
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    // Upload to Supabase Storage
    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update avatar_url in the preview
      if (data) {
        setAvatarPreview(data.publicUrl);
      }
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture will be updated when you save changes",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

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
      <div className="mb-6 p-4 bg-muted rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Profile Completeness</h3>
          <span className="text-sm font-medium">{currentCompleteness.completeness}%</span>
        </div>
        <Progress value={currentCompleteness.completeness} className="h-2.5 mb-2" />
        
        {showImprovement && (
          <Alert variant="default" className="bg-green-50 text-green-800 border-green-200 mt-2">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Looking good!</AlertTitle>
            <AlertDescription>
              Your profile will be {currentCompleteness.completeness - initialCompleteness.completeness}% more complete with these changes.
            </AlertDescription>
          </Alert>
        )}
        
        {currentCompleteness.missingFields.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">To complete your profile, add:</span>
            <ul className="list-disc ml-5 mt-1">
              {currentCompleteness.missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-24 w-24 mb-3 border-2 border-sportyfi-orange">
          <AvatarImage src={avatarPreview} />
          <AvatarFallback className="text-2xl bg-sportyfi-orange text-white">
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="relative">
          <Input
            type="file"
            id="avatar"
            className="sr-only"
            onChange={handleAvatarChange}
            accept="image/jpeg, image/png"
          />
          <Label
            htmlFor="avatar"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm font-medium transition-colors"
          >
            <Image className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">JPEG or PNG, max 5MB</p>
      </div>
      
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Your username"
        />
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={handleLocationChange}
          placeholder="Your location (e.g. New York, NY)"
        />
      </div>
      
      <div>
        <Label htmlFor="primarySport">Primary Sport</Label>
        <Select value={primarySport} onValueChange={handlePrimarySportChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your primary sport" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_SPORTS.map((sport) => (
              <SelectItem key={sport} value={sport}>{sport}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="block mb-2">Preferred Sports</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs text-muted-foreground mb-2 flex items-center cursor-help">
                <AlertCircle className="h-3 w-3 mr-1" /> 
                Select all sports you're interested in
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click on multiple sports to select them</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="overflow-y-auto max-h-40 bg-muted p-2 rounded-md">
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SPORTS.map((sport) => (
              <div key={sport} className="inline-block">
                <Button
                  type="button"
                  variant={preferredSports.includes(sport) ? "default" : "outline"}
                  size="sm"
                  className={preferredSports.includes(sport) 
                    ? "bg-sportyfi-orange hover:bg-red-600 text-white"
                    : "bg-white hover:bg-gray-100"
                  }
                  onClick={() => {
                    if (preferredSports.includes(sport)) {
                      setPreferredSports(preferredSports.filter(s => s !== sport));
                    } else {
                      setPreferredSports([...preferredSports, sport]);
                    }
                  }}
                >
                  {sport}
                </Button>
              </div>
            ))}
          </div>
        </div>
        {preferredSports.length > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Selected:</span> {preferredSports.join(', ')}
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={handleBioChange}
          placeholder="Tell us about yourself..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">Brief description about yourself, sports interests, etc.</p>
      </div>
      
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
