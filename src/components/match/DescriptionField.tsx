
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type DescriptionFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const DescriptionField: React.FC<DescriptionFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea 
        id="description" 
        name="description" 
        value={value} 
        onChange={onChange} 
        placeholder="Add details about your match, skill level, equipment needs, etc."
        rows={4}
      />
    </div>
  );
};

export default DescriptionField;
