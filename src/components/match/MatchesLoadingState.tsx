
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface MatchesLoadingStateProps {
  message?: string;
  isInitialLoad?: boolean;
}

const MatchesLoadingState: React.FC<MatchesLoadingStateProps> = ({ 
  message = "Loading matches...",
  isInitialLoad = true
}) => {
  if (isInitialLoad) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-sportyfi-orange" />
          <p className="text-gray-500">{message}</p>
          <p className="text-gray-400 text-sm mt-2">This might take a moment...</p>
        </div>
      </div>
    );
  }
  
  // For subsequent loads, show skeleton UI for better UX
  return (
    <div className="space-y-4">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesLoadingState;
