
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SportTypeFieldProps = {
  onValueChange: (value: string) => void;
};

const SportTypeField: React.FC<SportTypeFieldProps> = ({ onValueChange }) => {
  return (
    <div>
      <Label htmlFor="sport">Sport Type *</Label>
      <Select 
        onValueChange={(value) => onValueChange(value)}
        required
      >
        <SelectTrigger id="sport">
          <SelectValue placeholder="Select a sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basketball">Basketball</SelectItem>
          <SelectItem value="football">Football</SelectItem>
          <SelectItem value="tennis">Tennis</SelectItem>
          <SelectItem value="volleyball">Volleyball</SelectItem>
          <SelectItem value="cricket">Cricket</SelectItem>
          <SelectItem value="table tennis">Table Tennis</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SportTypeField;
