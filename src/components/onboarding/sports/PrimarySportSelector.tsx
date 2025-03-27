
import React from "react";
import { Label } from "@/components/ui/label";
import { SportCard, sportsList } from "./SportsList";

interface PrimarySportSelectorProps {
  primarySport: string;
  setPrimarySport: (sportId: string) => void;
}

const PrimarySportSelector: React.FC<PrimarySportSelectorProps> = ({ 
  primarySport, 
  setPrimarySport 
}) => {
  console.log("Rendering PrimarySportSelector with primarySport:", primarySport);

  return (
    <div>
      <Label className="text-base font-medium mb-3 block">Primary Sport</Label>
      <p className="text-sm text-gray-500 mb-4">This is the main sport you're interested in</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sportsList.map((sport) => (
          <SportCard
            key={sport.id}
            sport={sport}
            isSelected={primarySport === sport.id}
            onClick={() => setPrimarySport(sport.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PrimarySportSelector;
