
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="text-center py-8">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-sportyfi-orange" />
      <p className="text-xl">Loading match details...</p>
    </div>
  );
};

export default LoadingState;
