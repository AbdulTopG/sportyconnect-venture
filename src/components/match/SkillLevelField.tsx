
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SkillLevelFieldProps = {
  defaultValue?: string;
  onValueChange: (value: string) => void;
};

const SkillLevelField: React.FC<SkillLevelFieldProps> = ({ 
  defaultValue = 'all', 
  onValueChange 
}) => {
  return (
    <div>
      <Label htmlFor="skillLevel">Skill Level</Label>
      <Select 
        onValueChange={(value) => onValueChange(value)}
        defaultValue={defaultValue}
      >
        <SelectTrigger id="skillLevel">
          <SelectValue placeholder="Select skill level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
          <SelectItem value="all">All Levels Welcome</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SkillLevelField;
