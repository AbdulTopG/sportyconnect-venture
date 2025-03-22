
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicProfileFieldsProps {
  username: string;
  setUsername: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  primarySport: string;
  setPrimarySport: (value: string) => void;
  availableSports: string[];
}

const BasicProfileFields = ({
  username,
  setUsername,
  bio,
  setBio,
  location,
  setLocation,
  primarySport,
  setPrimarySport,
  availableSports
}: BasicProfileFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
        />
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Your location (e.g. New York, NY)"
        />
      </div>
      
      <div>
        <Label htmlFor="primarySport">Primary Sport</Label>
        <Select value={primarySport} onValueChange={setPrimarySport}>
          <SelectTrigger>
            <SelectValue placeholder="Select your primary sport" />
          </SelectTrigger>
          <SelectContent>
            {availableSports.map((sport) => (
              <SelectItem key={sport} value={sport}>{sport}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">Brief description about yourself, sports interests, etc.</p>
      </div>
    </>
  );
};

export default BasicProfileFields;
