
import React from "react";
import PrimarySportSelector from "./sports/PrimarySportSelector";
import SportsBadgeSelector from "./sports/SportsBadgeSelector";
import SkillLevelSelector from "./sports/SkillLevelSelector";
import { OnboardingFormData } from "@/hooks/use-onboarding-form";
import { useSportSelection } from "@/hooks/use-sport-selection";

interface OnboardingStepThreeProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
}

const OnboardingStepThree: React.FC<OnboardingStepThreeProps> = ({ formData, updateFormData }) => {
  const { toggleSport, setPrimarySport, setSkillLevel } = useSportSelection(formData, updateFormData);
  
  console.log("OnboardingStepThree formData:", formData);

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Sports</h2>
        <p className="text-gray-500">Tell us which sports you enjoy playing</p>
      </div>

      <div className="space-y-6">
        <PrimarySportSelector 
          primarySport={formData.primary_sport} 
          setPrimarySport={setPrimarySport}
        />
        
        <SportsBadgeSelector
          preferredSports={formData.preferred_sports || []}
          primarySport={formData.primary_sport}
          toggleSport={toggleSport}
        />
        
        <SkillLevelSelector
          skillLevel={formData.skill_level}
          setSkillLevel={setSkillLevel}
        />
      </div>
    </div>
  );
};

export default OnboardingStepThree;
