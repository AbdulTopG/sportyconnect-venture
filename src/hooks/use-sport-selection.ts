import { OnboardingFormData } from "@/hooks/use-onboarding-form";

export function useSportSelection(
  formData: OnboardingFormData, 
  updateFormData: (data: Partial<OnboardingFormData>) => void
) {
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

  return {
    toggleSport,
    setPrimarySport,
    setSkillLevel
  };
}
