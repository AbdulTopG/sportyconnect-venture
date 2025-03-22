
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading match details..." }: LoadingStateProps) => {
  console.log("Rendering LoadingState with message:", message);
  
  return (
    <div className="text-center py-8">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-sportyfi-orange" />
      <p className="text-xl">{message}</p>
      <p className="text-sm text-muted-foreground mt-2">This should only take a moment...</p>
    </div>
  );
};

export default LoadingState;
