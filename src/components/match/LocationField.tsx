
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type LocationFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LocationField: React.FC<LocationFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="location">Location *</Label>
      <Input 
        id="location" 
        name="location" 
        value={value} 
        onChange={onChange} 
        placeholder="Enter match location"
        required
      />
    </div>
  );
};

export default LocationField;
