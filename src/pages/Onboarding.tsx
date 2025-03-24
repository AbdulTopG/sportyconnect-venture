
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Check, User, MapPin, Trophy, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { calculateProfileCompleteness } from "@/lib/profile-utils";
import OnboardingStepOne from "@/components/onboarding/OnboardingStepOne";
import OnboardingStepTwo from "@/components/onboarding/OnboardingStepTwo";
import OnboardingStepThree from "@/components/onboarding/OnboardingStepThree";
import OnboardingStepFour from "@/components/onboarding/OnboardingStepFour";

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Location", icon: MapPin },
  { id: 3, name: "Sports", icon: Trophy },
  { id: 4, name: "Preferences", icon: ListChecks },
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    avatar_url: "",
    bio: "",
    location: "",
    primary_sport: "",
    preferred_sports: [] as string[],
    skill_level: "beginner",
    preferred_time: "weekday_evening",
    lookingFor: [] as string[],
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // In a real implementation, you would save the profile data to your backend
      console.log("Submitting profile data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile setup complete!",
        description: "Your SportyFi profile has been created successfully.",
      });
      
      // Redirect to dashboard or profile page
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't save your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStepOne formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <OnboardingStepTwo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <OnboardingStepThree formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <OnboardingStepFour formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // Calculate profile completeness using utility function
  const { completeness } = calculateProfileCompleteness({
    username: formData.username || null,
    avatar_url: formData.avatar_url || null,
    location: formData.location || null,
    primary_sport: formData.primary_sport || null,
    bio: formData.bio || null,
    preferred_sports: formData.preferred_sports.length ? formData.preferred_sports : null,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold sportyfi-gradient-text mb-2">Welcome to SportyFi</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Let's set up your profile so you can start connecting with other athletes.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    currentStep === step.id
                      ? "border-sportyfi-orange bg-sportyfi-orange text-white"
                      : currentStep > step.id
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium",
                    currentStep === step.id
                      ? "text-sportyfi-orange"
                      : currentStep > step.id
                      ? "text-green-500"
                      : "text-gray-400"
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-200 h-2 rounded-full max-w-xl mx-auto">
            <div
              className="bg-sportyfi-orange h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-lg border-gray-200">
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
          <CardFooter className="flex justify-between pt-2 pb-6 px-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">
                Profile: <span className="font-medium">{completeness}% complete</span>
              </div>
              <Button onClick={handleNext}>
                {currentStep < steps.length ? (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
