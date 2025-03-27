import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface OnboardingFormData {
  primary_sport: string;
  preferred_sports: string[];
  skill_level: string;
}

interface OnboardingStepThreeProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
}

const sportsList = [
  { id: "football", name: "Football", icon: "⚽" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "table_tennis", name: "Table Tennis", icon: "🏓" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "running", name: "Running", icon: "🏃" },
  { id: "cycling", name: "Cycling", icon: "🚴" },
  { id: "yoga", name: "Yoga", icon: "🧘" },
  { id: "golf", name: "Golf", icon: "⛳" },
];

const skillLevels = [
  { value: "beginner", label: "Beginner", description: "New to the sport or play occasionally" },
  { value: "intermediate", label: "Intermediate", description: "Regular player with some experience" },
  { value: "advanced", label: "Advanced", description: "Experienced player with good skills" },
  { value: "expert", label: "Expert", description: "Highly skilled, competitive player" },
];

const OnboardingStepThree = ({ formData, updateFormData }: OnboardingStepThreeProps) => {
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

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Sports</h2>
        <p className="text-gray-500">Tell us which sports you enjoy playing</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Primary Sport</Label>
          <p className="text-sm text-gray-500 mb-4">This is the main sport you're interested in</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sportsList.map((sport) => (
              <div
                key={sport.id}
                className={cn(
                  "border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all hover:border-sportyfi-orange",
                  formData.primary_sport === sport.id 
                    ? "border-2 border-sportyfi-orange bg-orange-50"
                    : "border-gray-200"
                )}
                onClick={() => setPrimarySport(sport.id)}
              >
                <div className="text-2xl">{sport.icon}</div>
                <div className="font-medium">{sport.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium mb-3 block">Other Sports</Label>
          <p className="text-sm text-gray-500 mb-4">Select all other sports you're interested in</p>
          
          <div className="flex flex-wrap gap-2">
            {sportsList.map((sport) => (
              <Badge
                key={sport.id}
                variant={(formData.preferred_sports || []).includes(sport.id) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer text-sm py-1.5 px-3",
                  (formData.preferred_sports || []).includes(sport.id) 
                    ? "bg-sportyfi-orange hover:bg-red-600"
                    : "hover:bg-gray-100",
                  formData.primary_sport === sport.id && "border-2"
                )}
                onClick={() => toggleSport(sport.id)}
              >
                {sport.icon} {sport.name}
                {formData.primary_sport === sport.id && " (Primary)"}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium mb-3 block">Your Skill Level</Label>
          
          <RadioGroup
            value={formData.skill_level || "intermediate"}
            onValueChange={(value) => updateFormData({ skill_level: value })}
            className="space-y-3"
          >
            {skillLevels.map((level) => (
              <div
                key={level.value}
                className={cn(
                  "flex items-start space-x-2 border rounded-lg p-3 transition-all",
                  formData.skill_level === level.value ? "border-sportyfi-orange bg-orange-50" : "border-gray-200"
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
      </div>
    </div>
  );
};

export default OnboardingStepThree;
