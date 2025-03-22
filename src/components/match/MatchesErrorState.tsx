
import React from 'react';
import { Button } from '@/components/ui/button';

interface MatchesErrorStateProps {
  error: string;
  onRetry: () => void;
}

const MatchesErrorState: React.FC<MatchesErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium mb-4 text-red-600">{error}</h2>
      <Button onClick={onRetry} className="mr-4">Try Again</Button>
    </div>
  );
};

export default MatchesErrorState;
