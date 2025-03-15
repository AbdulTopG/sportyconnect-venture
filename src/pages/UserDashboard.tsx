
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserBookings from '@/components/user/UserBookings';
import UserFavorites from '@/components/user/UserFavorites';
import UserReviews from '@/components/user/UserReviews';
import { User, Clock, Heart } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Ensure user is logged in
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 bg-sportyfi-orange rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <Tabs defaultValue="bookings" className="space-y-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">My Bookings</span>
                <span className="sm:hidden">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorite Venues</span>
                <span className="sm:hidden">Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">My Reviews</span>
                <span className="sm:hidden">Reviews</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>
                    View and manage your venue bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserBookings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Venues</CardTitle>
                  <CardDescription>
                    Quick access to your favorite venues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserFavorites />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                  <CardDescription>
                    Reviews you've left for venues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserReviews />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
