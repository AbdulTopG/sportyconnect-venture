
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const OnboardingNavigation = ({
  currentStep,
  totalSteps,
  isStepValid,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}: OnboardingNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      {currentStep < totalSteps ? (
        <Button
          onClick={onNext}
          disabled={!isStepValid}
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
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
  );
};

export default OnboardingNavigation;
