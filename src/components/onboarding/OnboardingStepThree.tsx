import React from "react";
import PrimarySportSelector from "./sports/PrimarySportSelector";
import SportsBadgeSelector from "./sports/SportsBadgeSelector";
import SkillLevelSelector from "./sports/SkillLevelSelector";
import { OnboardingFormData } from "@/hooks/use-onboarding-form";

interface OnboardingStepThreeProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
}

const OnboardingStepThree: React.FC<OnboardingStepThreeProps> = ({ formData, updateFormData }) => {
  const toggleSport = (sportId: string) => {
    const isPrimary = formData.primary_sport === sportId;
    const isSelected = (formData.preferred_sports || []).includes(sportId);
    
    if (isPrimary) {
      // If it's the primary sport, just remove it from preferred (but keep it as primary)
      if (isSelected) {
        updateFormData({
          preferred_sports: (formData.preferred_sports || []).filter(id => id !== sportId)
        });
      } else {
        updateFormData({
          preferred_sports: [...(formData.preferred_sports || []), sportId]
        });
      }
    } else {
      // If selecting a new sport
      if (!isSelected) {
        // Add to preferred
        updateFormData({
          preferred_sports: [...(formData.preferred_sports || []), sportId]
        });
      } else {
        // Remove from preferred
        updateFormData({
          preferred_sports: (formData.preferred_sports || []).filter(id => id !== sportId)
        });
      }
    }
  };
  
  const setPrimarySport = (sportId: string) => {
    // If this sport isn't already in preferred, add it
    if (!(formData.preferred_sports || []).includes(sportId)) {
      updateFormData({
        primary_sport: sportId,
        preferred_sports: [...(formData.preferred_sports || []), sportId]
      });
    } else {
      updateFormData({ primary_sport: sportId });
    }
  };

  const setSkillLevel = (value: string) => {
    updateFormData({ skill_level: value });
  };

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
