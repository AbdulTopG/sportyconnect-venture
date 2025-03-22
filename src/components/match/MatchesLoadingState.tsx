
import React from 'react';
import { Loader2 } from 'lucide-react';

const MatchesLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading matches...</p>
      </div>
    </div>
  );
};

export default MatchesLoadingState;
