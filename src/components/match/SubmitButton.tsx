
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

type SubmitButtonProps = {
  isSubmitting: boolean;
  isSuccess: boolean;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, isSuccess }) => {
  return (
    <div className="pt-2">
      <Button 
        type="submit" 
        disabled={isSubmitting || isSuccess}
        className="w-full bg-sportyfi-orange hover:bg-red-600 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating Match...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Match Created
          </>
        ) : (
          "Create Match"
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
