
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigateFunction } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string | null;
  navigate: NavigateFunction;
}

const ErrorState = ({ error, navigate }: ErrorStateProps) => {
  console.log("Rendering ErrorState with error:", error);
  
  return (
    <div className="text-center py-8">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
      <p className="text-xl text-red-600 mb-4">{error || "Match not found"}</p>
      <p className="text-gray-600 mb-4">There was a problem loading this page. Please try again later.</p>
      <Button 
        className="bg-sportyfi-orange hover:bg-red-600"
        onClick={() => navigate('/matches')}
      >
        Back to Matches
      </Button>
    </div>
  );
};

export default ErrorState;
