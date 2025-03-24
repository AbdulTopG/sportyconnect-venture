
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface OnboardingStepThreeProps {
  formData: {
    primary_sport: string;
    preferred_sports: string[];
    skill_level: string;
  };
  updateFormData: (data: Partial<typeof formData>) => void;
}

const sportsList = [
  { id: "soccer", name: "Soccer", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "running", name: "Running", icon: "🏃" },
  { id: "cycling", name: "Cycling", icon: "🚴" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "golf", name: "Golf", icon: "⛳" },
  { id: "yoga", name: "Yoga", icon: "🧘" },
  { id: "boxing", name: "Boxing", icon: "🥊" },
  { id: "climbing", name: "Climbing", icon: "🧗" },
  { id: "baseball", name: "Baseball", icon: "⚾" },
];

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "professional", label: "Professional" },
];

const OnboardingStepThree = ({ formData, updateFormData }: OnboardingStepThreeProps) => {
  const handleSportSelection = (sportId: string) => {
    const currentPreferred = [...formData.preferred_sports];
    
    if (currentPreferred.includes(sportId)) {
      // Remove from preferred sports
      updateFormData({
        preferred_sports: currentPreferred.filter(id => id !== sportId),
        // If removing primary sport, reset it
        ...(formData.primary_sport === sportId ? { primary_sport: "" } : {})
      });
    } else {
      // Add to preferred sports
      updateFormData({
        preferred_sports: [...currentPreferred, sportId],
        // If this is the first sport, make it primary
        ...(currentPreferred.length === 0 ? { primary_sport: sportId } : {})
      });
    }
  };

  const setPrimarySport = (sportId: string) => {
    // Ensure the sport is in preferred sports
    if (!formData.preferred_sports.includes(sportId)) {
      updateFormData({
        preferred_sports: [...formData.preferred_sports, sportId],
        primary_sport: sportId
      });
    } else {
      updateFormData({ primary_sport: sportId });
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Sports</h2>
        <p className="text-gray-500">Tell us which sports you're interested in</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base">Select your sports (choose all that apply)</Label>
          <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-3">
            {sportsList.map((sport) => (
              <div
                key={sport.id}
                className={cn(
                  "relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                  formData.preferred_sports.includes(sport.id)
                    ? "border-sportyfi-orange bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => handleSportSelection(sport.id)}
              >
                {formData.preferred_sports.includes(sport.id) && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-sportyfi-orange" />
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl mb-1">{sport.icon}</div>
                  <p className="text-sm font-medium">{sport.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.preferred_sports.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base">Select your primary sport</Label>
            <RadioGroup
              value={formData.primary_sport}
              onValueChange={setPrimarySport}
              className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-3"
            >
              {sportsList
                .filter(sport => formData.preferred_sports.includes(sport.id))
                .map(sport => (
                  <div key={sport.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={sport.id} id={`primary-${sport.id}`} />
                    <Label htmlFor={`primary-${sport.id}`} className="cursor-pointer">
                      <span className="mr-1">{sport.icon}</span> {sport.name}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-base">What's your skill level?</Label>
          <RadioGroup
            value={formData.skill_level}
            onValueChange={(value) => updateFormData({ skill_level: value })}
            className="grid grid-cols-2 gap-3 mt-3"
          >
            {skillLevels.map(level => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={`skill-${level.value}`} />
                <Label htmlFor={`skill-${level.value}`} className="cursor-pointer">
                  {level.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepThree;
