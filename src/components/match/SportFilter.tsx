
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SportFilterProps {
  selectedSport: string | null;
  allSports: string[];
  onSportChange: (sport: string) => void;
}

const SportFilter: React.FC<SportFilterProps> = ({ 
  selectedSport, 
  allSports, 
  onSportChange 
}) => {
  return (
    <div className="w-full md:w-48">
      <Select 
        value={selectedSport || 'all'} 
        onValueChange={onSportChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sports</SelectItem>
          {allSports.map(sport => (
            <SelectItem key={sport} value={sport}>
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SportFilter;
