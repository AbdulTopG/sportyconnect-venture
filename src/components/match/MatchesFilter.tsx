
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, Filter } from 'lucide-react';

interface MatchesFilterProps {
  searchTerm: string;
  skillLevel: string | null;
  timeFilter: string | null;
  showFull: boolean;
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onSkillLevelChange: (value: string | null) => void;
  onTimeFilterChange: (value: string | null) => void;
  onShowFullChange: (value: boolean) => void;
  onToggleFilters: () => void;
  onClearFilter: () => void;
}

const MatchesFilter: React.FC<MatchesFilterProps> = ({
  searchTerm,
  skillLevel,
  timeFilter,
  showFull,
  showFilters,
  onSearchChange,
  onSkillLevelChange,
  onTimeFilterChange,
  onShowFullChange,
  onToggleFilters,
  onClearFilter
}) => {
  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by location, sport, or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          type="button"
          variant="outline" 
          onClick={(e) => {
            e.preventDefault();
            onToggleFilters();
          }}
          className="md:w-auto flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id="showFull" 
            checked={showFull} 
            onCheckedChange={(checked) => onShowFullChange(checked as boolean)}
          />
          <Label htmlFor="showFull" className="text-sm cursor-pointer">Show full matches</Label>
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <Label className="block mb-2 text-sm font-medium">Skill Level</Label>
            <Select 
              value={skillLevel || ''} 
              onValueChange={(value) => onSkillLevelChange(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All skill levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All skill levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="all">All levels welcome</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block mb-2 text-sm font-medium">Time Frame</Label>
            <ToggleGroup type="single" value={timeFilter || ''} onValueChange={(value) => onTimeFilterChange(value || null)}>
              <ToggleGroupItem value="today" className="text-xs">Today</ToggleGroupItem>
              <ToggleGroupItem value="this-week" className="text-xs">This Week</ToggleGroupItem>
              <ToggleGroupItem value="weekend" className="text-xs">Weekend</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="flex items-end">
            <Button 
              type="button"
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                onClearFilter();
              }} 
              className="text-gray-600"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesFilter;
