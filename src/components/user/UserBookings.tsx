
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { MapPin, Calendar, Clock, X } from 'lucide-react';

interface UserBooking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  notes: string | null;
  created_at: string;
  venue: {
    id: string;
    name: string;
    location: string;
    images?: { image_url: string }[];
  };
}

const UserBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(
            id, 
            name, 
            location,
            images:venue_images(image_url)
          )
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });
      
      if (error) throw error;
      
      setBookings(data as UserBooking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, [user]);
  
  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update the local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
      
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully',
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
  
  const getVenueImage = (venue: UserBooking['venue']) => {
    if (venue.images && venue.images.length > 0) {
      return venue.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80';
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading your bookings...</div>;
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Calendar className="h-12 w-12 mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't made any venue bookings yet.
        </p>
        <Link to="/venues">
          <Button>Browse Venues</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-lg border bg-card overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 h-40 relative">
                <img 
                  src={getVenueImage(booking.venue)} 
                  alt={booking.venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.venue.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{booking.venue.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 md:mt-0 md:text-right">
                    <div className="flex items-center md:justify-end text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center md:justify-end text-muted-foreground mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{booking.start_time} - {booking.end_time}</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <span className="text-muted-foreground">Total Price:</span>
                    <span className="font-semibold ml-2">₹{booking.total_price}</span>
                  </div>
                  
                  <div className="mt-3 md:mt-0 flex gap-2">
                    <Link to={`/venues/${booking.venue.id}`}>
                      <Button variant="outline" size="sm">View Venue</Button>
                    </Link>
                    
                    {booking.status === 'pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Booking</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel this booking? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>
                              Keep Booking
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => cancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {booking.status === 'confirmed' && new Date(booking.booking_date) > new Date() && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Booking</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel this booking? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>
                              Keep Booking
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => cancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {booking.status === 'completed' && (
                      <Link to={`/venues/${booking.venue.id}?review=true`}>
                        <Button variant="default" size="sm">
                          Leave Review
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;
