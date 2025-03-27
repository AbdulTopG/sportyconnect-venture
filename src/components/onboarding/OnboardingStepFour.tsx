
import { Clock, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface OnboardingFormData {
  preferred_time: string;
  lookingFor: string[];
}

interface OnboardingStepFourProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
}

const timePreferences = [
  { value: "weekday_morning", label: "Weekday Mornings" },
  { value: "weekday_afternoon", label: "Weekday Afternoons" },
  { value: "weekday_evening", label: "Weekday Evenings" },
  { value: "weekend_morning", label: "Weekend Mornings" },
  { value: "weekend_afternoon", label: "Weekend Afternoons" },
  { value: "weekend_evening", label: "Weekend Evenings" },
];

const lookingForOptions = [
  { id: "casual_games", label: "Casual Games" },
  { id: "competitive_matches", label: "Competitive Matches" },
  { id: "training_partners", label: "Training Partners" },
  { id: "coaching", label: "Coaching" },
  { id: "tournaments", label: "Tournaments" },
  { id: "leagues", label: "Leagues" },
  { id: "social_events", label: "Social Events" },
];

const OnboardingStepFour = ({ formData, updateFormData }: OnboardingStepFourProps) => {
  const handleLookingForChange = (value: string) => {
    const current = [...(formData.lookingFor || [])];
    
    if (current.includes(value)) {
      updateFormData({
        lookingFor: current.filter(item => item !== value)
      });
    } else {
      updateFormData({
        lookingFor: [...current, value]
      });
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Preferences</h2>
        <p className="text-gray-500">Help us match you with the right opportunities</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-sportyfi-orange" />
            <Label className="text-base font-medium">When do you prefer to play?</Label>
          </div>
          
          <RadioGroup
            value={formData.preferred_time || ""}
            onValueChange={(value) => updateFormData({ preferred_time: value })}
            className="grid grid-cols-2 gap-3 mt-3"
          >
            {timePreferences.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`time-${option.value}`} />
                <Label htmlFor={`time-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-sportyfi-orange" />
            <Label className="text-base font-medium">What are you looking for? (Select all that apply)</Label>
          </div>
          
          <div className="space-y-3 mt-3">
            {lookingForOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`looking-${option.id}`}
                  checked={(formData.lookingFor || []).includes(option.id)}
                  onCheckedChange={() => handleLookingForChange(option.id)}
                />
                <Label htmlFor={`looking-${option.id}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-6">
          <p className="text-sm text-blue-700">
            Based on your preferences, we'll recommend matches, tournaments, and players that align with your interests.
            You can update these preferences anytime from your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepFour;
