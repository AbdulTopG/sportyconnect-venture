
import React from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>About Stats & Achievements</AlertTitle>
            <AlertDescription>
              Your stats and achievements are generated automatically based on your participation in SportyFi matches. 
              They cannot be manually edited and are updated after each match you participate in.
            </AlertDescription>
          </Alert>
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileLayout;
