
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigateFunction } from 'react-router-dom';

interface ErrorStateProps {
  error: string | null;
  navigate: NavigateFunction;
}

const ErrorState = ({ error, navigate }: ErrorStateProps) => {
  return (
    <div className="text-center">
      <p className="text-xl text-red-600">{error || "Match not found"}</p>
      <Button 
        className="mt-4"
        onClick={() => navigate('/matches')}
      >
        Back to Matches
      </Button>
    </div>
  );
};

export default ErrorState;
