
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface MatchesErrorStateProps {
  error: string;
  onRetry: () => void;
}

const MatchesErrorState: React.FC<MatchesErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-medium mb-4 text-red-600">{error}</h2>
      <p className="text-gray-600 mb-4">There was a problem loading the matches.</p>
      <Button onClick={onRetry} variant="default" className="mr-4">
        Try Again
      </Button>
    </div>
  );
};

export default MatchesErrorState;
