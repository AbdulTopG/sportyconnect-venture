
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { sportsList } from "./SportsList";

interface SportsBadgeSelectorProps {
  preferredSports: string[];
  primarySport: string;
  toggleSport: (sportId: string) => void;
}

const SportsBadgeSelector: React.FC<SportsBadgeSelectorProps> = ({
  preferredSports,
  primarySport,
  toggleSport
}) => {
  return (
    <div>
      <Label className="text-base font-medium mb-3 block">Other Sports</Label>
      <p className="text-sm text-gray-500 mb-4">Select all other sports you're interested in</p>
      
      <div className="flex flex-wrap gap-2">
        {sportsList.map((sport) => (
          <Badge
            key={sport.id}
            variant={preferredSports.includes(sport.id) ? "default" : "outline"}
            className={cn(
              "cursor-pointer text-sm py-1.5 px-3",
              preferredSports.includes(sport.id) 
                ? "bg-sportyfi-orange hover:bg-red-600"
                : "hover:bg-gray-100",
              primarySport === sport.id && "border-2"
            )}
            onClick={() => toggleSport(sport.id)}
          >
            {sport.icon} {sport.name}
            {primarySport === sport.id && " (Primary)"}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SportsBadgeSelector;
