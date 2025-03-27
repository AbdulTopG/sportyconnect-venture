
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import OnboardingStepOne from "@/components/onboarding/OnboardingStepOne";
import OnboardingStepTwo from "@/components/onboarding/OnboardingStepTwo";
import OnboardingStepThree from "@/components/onboarding/OnboardingStepThree";
import OnboardingStepFour from "@/components/onboarding/OnboardingStepFour";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingNavigation from "@/components/onboarding/OnboardingNavigation";
import { useOnboardingForm } from "@/hooks/use-onboarding-form";

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    isSubmitting,
    updateFormData,
    nextStep,
    prevStep,
    isStepValid,
    handleSubmit
  } = useOnboardingForm();
  
  // Redirect if user is not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <OnboardingProgress currentStep={currentStep} totalSteps={4} />
          
          {renderStep()}
          
          <OnboardingNavigation
            currentStep={currentStep}
            totalSteps={4}
            isStepValid={isStepValid()}
            isSubmitting={isSubmitting}
            onPrevious={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
