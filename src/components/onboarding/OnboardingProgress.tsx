
import React from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Set Up Your SportyFi Profile</h1>
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
        <div 
          className="bg-sportyfi-orange h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Personal Info</span>
        <span>Location</span>
        <span>Sports</span>
        <span>Preferences</span>
      </div>
    </div>
  );
};

export default OnboardingProgress;
