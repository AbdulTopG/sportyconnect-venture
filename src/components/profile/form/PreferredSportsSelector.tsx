
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PreferredSportsSelectorProps {
  preferredSports: string[];
  setPreferredSports: (sports: string[]) => void;
  availableSports: string[];
}

const PreferredSportsSelector = ({ 
  preferredSports, 
  setPreferredSports, 
  availableSports 
}: PreferredSportsSelectorProps) => {
  return (
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
          {availableSports.map((sport) => (
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
  );
};

export default PreferredSportsSelector;
