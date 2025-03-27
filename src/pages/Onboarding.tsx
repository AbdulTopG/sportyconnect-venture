
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import OnboardingStepOne from "@/components/onboarding/OnboardingStepOne";
import OnboardingStepTwo from "@/components/onboarding/OnboardingStepTwo";
import OnboardingStepThree from "@/components/onboarding/OnboardingStepThree";
import OnboardingStepFour from "@/components/onboarding/OnboardingStepFour";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface OnboardingFormData {
  username: string;
  fullName: string;
  avatar_url: string;
  bio: string;
  location: string;
  primary_sport: string;
  preferred_sports: string[];
  skill_level: string;
  preferred_time: string;
  lookingFor: string[];
}

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    username: "",
    fullName: "",
    avatar_url: "",
    bio: "",
    location: "",
    primary_sport: "",
    preferred_sports: [],
    skill_level: "intermediate",
    preferred_time: "weekend_afternoon",
    lookingFor: []
  });
  
  // Redirect if user is not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Update the user's profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          avatar_url: formData.avatar_url,
          bio: formData.bio,
          location: formData.location,
          primary_sport: formData.primary_sport,
          preferred_sports: formData.preferred_sports,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated successfully!",
        description: "Your profile has been set up and you're ready to go.",
      });
      
      // Redirect to the dashboard
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
  
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.username && !!formData.fullName;
      case 2:
        return !!formData.location;
      case 3:
        return !!formData.primary_sport;
      case 4:
        return true;
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Set Up Your SportyFi Profile</h1>
              <div className="text-sm text-gray-500">
                Step {currentStep} of 4
              </div>
            </div>
            
            <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
              <div 
                className="bg-sportyfi-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Personal Info</span>
              <span>Location</span>
              <span>Sports</span>
              <span>Preferences</span>
            </div>
          </div>
          
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
