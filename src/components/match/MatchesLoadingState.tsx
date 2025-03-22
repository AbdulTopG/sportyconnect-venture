
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MatchesLoadingStateProps {
  message?: string;
}

const MatchesLoadingState: React.FC<MatchesLoadingStateProps> = ({ 
  message = "Loading matches..." 
}) => {
  console.log("Rendering MatchesLoadingState with message:", message);
  
  return (
    <div className="flex justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-sportyfi-orange" />
        <p className="text-gray-500">{message}</p>
        <p className="text-gray-400 text-sm mt-2">This might take a moment...</p>
      </div>
    </div>
  );
};

export default MatchesLoadingState;
