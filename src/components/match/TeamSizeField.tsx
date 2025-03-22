
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TeamSizeFieldProps = {
  onValueChange: (value: string) => void;
};

const TeamSizeField: React.FC<TeamSizeFieldProps> = ({ onValueChange }) => {
  return (
    <div>
      <Label htmlFor="teamSize">Team Size *</Label>
      <Select 
        onValueChange={(value) => onValueChange(value)}
        required
      >
        <SelectTrigger id="teamSize">
          <SelectValue placeholder="Select team size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">2 players</SelectItem>
          <SelectItem value="3">3 players</SelectItem>
          <SelectItem value="5">5 players</SelectItem>
          <SelectItem value="6">6 players</SelectItem>
          <SelectItem value="11">11 players</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamSizeField;
