
import React, { useState } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import PlayerDashboard from '@/components/match/PlayerDashboard';
import ProfileEditForm from '@/components/match/ProfileEditForm';
import { useProfileData } from '@/hooks/use-profile-data';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, refreshProfileData, loading } = useProfileData();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const handleSaveProfile = () => {
    refreshProfileData();
    setActiveTab('dashboard');
  };

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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
              <TabsTrigger value="edit" className="flex-1">Edit Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <PlayerDashboard />
            </TabsContent>
            
            <TabsContent value="edit">
              <div className="max-w-2xl mx-auto">
                <div className="sportyfi-card">
                  <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
                  
                  {loading.profile ? (
                    <div className="flex justify-center py-10">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-sportyfi-orange"></div>
                    </div>
                  ) : profile ? (
                    <ProfileEditForm user={profile} onSave={handleSaveProfile} />
                  ) : (
                    <p className="text-center text-muted-foreground">Unable to load profile</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
