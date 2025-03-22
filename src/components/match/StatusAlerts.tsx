
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

type StatusAlertsProps = {
  isLoggedIn: boolean;
  createSuccess: boolean;
};

const StatusAlerts: React.FC<StatusAlertsProps> = ({ isLoggedIn, createSuccess }) => {
  return (
    <>
      {!isLoggedIn && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to host a match. 
            <div className="mt-2">
              <Link to="/auth" className="text-sportyfi-orange hover:underline">
                Log in or sign up
              </Link>
              {" to continue."}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {createSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Match Created!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your match has been successfully created and is now visible to other users.
            Redirecting you to the matches page...
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default StatusAlerts;
