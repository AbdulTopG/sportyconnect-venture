
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface OnboardingFormData {
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

export function useOnboardingForm() {
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

  return {
    currentStep,
    formData,
    isSubmitting,
    updateFormData,
    nextStep,
    prevStep,
    isStepValid,
    handleSubmit
  };
}
