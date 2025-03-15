
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Venue {
  id: string;
  name: string;
  location: string;
}

interface User {
  id: string;
  email?: string;
  username?: string;
}

interface BookingRequest {
  id: string;
  venue_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
  venue: Venue;
  user: User;
}

const AdminBookingRequests = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location),
          user:profiles(id, username, email)
        `)
        .order('booking_date', { ascending: false });
      
      if (error) throw error;
      
      console.log('Bookings data:', data);
      
      // Check that each booking has the expected venue and user data
      const validBookings = data?.filter(booking => 
        booking.venue && booking.user
      ) as BookingRequest[] || [];
      
      setBookings(validBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load booking requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const confirmBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update the local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'confirmed' } 
          : booking
      ));
      
      toast({
        title: 'Booking Confirmed',
        description: 'The booking has been confirmed successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to confirm booking',
        variant: 'destructive',
      });
    }
  };
  
  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update the local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      toast({
        title: 'Booking Cancelled',
        description: 'The booking has been cancelled',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading booking requests...</div>;
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No booking requests found.</p>
      </div>
    );
  }
  
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const otherBookings = bookings.filter(booking => booking.status !== 'pending');
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-2">Pending Requests</h3>
      
      {pendingBookings.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No pending booking requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{booking.venue.name}</CardTitle>
                  {getStatusBadge(booking.status)}
                </div>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {booking.venue.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {booking.start_time} - {booking.end_time}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Requested by:</p>
                    <p className="text-sm">{booking.user.username || 'Anonymous User'}</p>
                    <p className="text-sm text-muted-foreground">{booking.user.email || 'No email'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Price:</p>
                    <p className="text-lg font-semibold">₹{booking.total_price}</p>
                  </div>
                  
                  {booking.notes && (
                    <div>
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm text-muted-foreground">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className="flex gap-3 w-full">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this booking request?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>
                          No, Keep It
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Yes, Cancel It
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Booking</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to confirm this booking request?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          onClick={() => confirmBooking(booking.id)}
                        >
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {otherBookings.length > 0 && (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-medium mb-4">Recent Bookings</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {otherBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{booking.venue.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.booking_date).toLocaleDateString()} • {booking.start_time} - {booking.end_time}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Booked by: {booking.user.username || booking.user.email || 'Unknown user'}
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBookingRequests;
