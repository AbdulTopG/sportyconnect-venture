
import { useState } from "react";
import { User, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OnboardingFormData {
  username: string;
  fullName: string;
  avatar_url: string;
  bio: string;
}

interface OnboardingStepOneProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
}

const OnboardingStepOne = ({ formData, updateFormData }: OnboardingStepOneProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = () => {
    // Simulate upload - in a real implementation, you would use actual upload logic
    setIsUploading(true);
    setTimeout(() => {
      updateFormData({
        avatar_url: `https://ui-avatars.com/api/?name=${formData.fullName || "User"}&background=FF5050&color=fff`,
      });
      setIsUploading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-gray-500">Let's get to know you better</p>
      </div>

      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-md">
          <AvatarImage src={formData.avatar_url} />
          <AvatarFallback className="bg-sportyfi-orange text-white text-xl">
            <User className="w-10 h-10" />
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={handleAvatarUpload}
          className="flex items-center text-sm font-medium text-sportyfi-orange hover:text-red-600"
          disabled={isUploading}
        >
          <Upload className="mr-1 w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload profile picture"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) => updateFormData({ username: e.target.value })}
          />
          <p className="text-xs text-gray-500">
            This will be your public handle that others can use to find you
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself..."
            rows={4}
            value={formData.bio}
            onChange={(e) => updateFormData({ bio: e.target.value })}
          />
          <p className="text-xs text-gray-500">
            Share your sporting journey, achievements, or goals
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepOne;
