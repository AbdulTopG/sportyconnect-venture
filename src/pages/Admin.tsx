import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminVenueRequests from '@/components/admin/AdminVenueRequests';
import AdminVenuesList from '@/components/admin/AdminVenuesList';
import AdminBookingRequests from '@/components/admin/AdminBookingRequests';
import { ShieldCheck, Lock } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        // Check if the user is an admin by querying the profiles table for role field
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Authentication Error",
          description: "Please try again later.",
          variant: "destructive",
        });
        navigate('/');
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, toast]);
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Lock className="w-12 h-12 text-gray-400" />
              </div>
              <CardTitle className="text-center">Restricted Area</CardTitle>
              <CardDescription className="text-center">
                This area is only accessible to administrators.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/')} className="w-full">
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-sportyfi-orange" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-base">
              {user?.email}
            </Badge>
          </div>
          
          <Tabs defaultValue="venue-requests" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="venue-requests">Venue Requests</TabsTrigger>
              <TabsTrigger value="venues">Manage Venues</TabsTrigger>
              <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="venue-requests">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Listing Requests</CardTitle>
                  <CardDescription>
                    Review and manage venue listing requests from users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminVenueRequests />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="venues">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Venues</CardTitle>
                  <CardDescription>
                    View, edit, and add new venues to the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Link to="/admin/add-venue">
                      <Button>Add New Venue</Button>
                    </Link>
                  </div>
                  <Separator className="my-4" />
                  <AdminVenuesList />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Requests</CardTitle>
                  <CardDescription>
                    Review and manage booking requests from users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminBookingRequests />
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

export default Admin;
