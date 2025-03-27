
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface SkillLevel {
  value: string;
  label: string;
  description: string;
}

export const skillLevels: SkillLevel[] = [
  { value: "beginner", label: "Beginner", description: "New to the sport or play occasionally" },
  { value: "intermediate", label: "Intermediate", description: "Regular player with some experience" },
  { value: "advanced", label: "Advanced", description: "Experienced player with good skills" },
  { value: "expert", label: "Expert", description: "Highly skilled, competitive player" },
];

interface SkillLevelSelectorProps {
  skillLevel: string;
  setSkillLevel: (value: string) => void;
}

const SkillLevelSelector: React.FC<SkillLevelSelectorProps> = ({
  skillLevel,
  setSkillLevel
}) => {
  return (
    <div>
      <Label className="text-base font-medium mb-3 block">Your Skill Level</Label>
      
      <RadioGroup
        value={skillLevel || "intermediate"}
        onValueChange={setSkillLevel}
        className="space-y-3"
      >
        {skillLevels.map((level) => (
          <div
            key={level.value}
            className={cn(
              "flex items-start space-x-2 border rounded-lg p-3 transition-all",
              skillLevel === level.value ? "border-sportyfi-orange bg-orange-50" : "border-gray-200"
            )}
          >
            <RadioGroupItem value={level.value} id={`skill-${level.value}`} className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor={`skill-${level.value}`} className="font-medium cursor-pointer">
                {level.label}
              </Label>
              <p className="text-sm text-gray-500">{level.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SkillLevelSelector;
