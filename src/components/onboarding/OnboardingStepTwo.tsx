
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface OnboardingFormData {
  location: string;
}

interface OnboardingStepTwoProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
}

const popularLocations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
];

const OnboardingStepTwo = ({ formData, updateFormData }: OnboardingStepTwoProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = searchQuery 
    ? popularLocations.filter(loc => 
        loc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularLocations;

  return (
    <div className="space-y-6 py-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Location</h2>
        <p className="text-gray-500">Help us find sporting events near you</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Your City and State</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="location"
              className="pl-10"
              placeholder="Enter your city and state"
              value={formData.location || searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateFormData({ location: e.target.value });
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            This helps us show you nearby matches and venues
          </p>
        </div>

        {filteredLocations.length > 0 && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Popular locations</p>
              <div className="grid grid-cols-2 gap-2">
                {filteredLocations.map((location) => (
                  <Button
                    key={location}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      updateFormData({ location });
                      setSearchQuery("");
                    }}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your location will only be shared with other users when you join or host matches
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepTwo;
