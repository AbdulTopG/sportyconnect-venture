
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

interface ProfileCompletenessProps {
  currentCompleteness: {
    completeness: number;
    missingFields: string[];
  };
  initialCompleteness: {
    completeness: number;
  };
}

const ProfileCompleteness = ({ currentCompleteness, initialCompleteness }: ProfileCompletenessProps) => {
  const showImprovement = currentCompleteness.completeness > initialCompleteness.completeness;
  
  return (
    <div className="mb-6 p-4 bg-muted rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Profile Completeness</h3>
        <span className="text-sm font-medium">{currentCompleteness.completeness}%</span>
      </div>
      <Progress value={currentCompleteness.completeness} className="h-2.5 mb-2" />
      
      {showImprovement && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200 mt-2">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Looking good!</AlertTitle>
          <AlertDescription>
            Your profile will be {currentCompleteness.completeness - initialCompleteness.completeness}% more complete with these changes.
          </AlertDescription>
        </Alert>
      )}
      
      {currentCompleteness.missingFields.length > 0 && (
        <div className="text-xs text-muted-foreground mt-2">
          <span className="font-medium">To complete your profile, add:</span>
          <ul className="list-disc ml-5 mt-1">
            {currentCompleteness.missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCompleteness;
