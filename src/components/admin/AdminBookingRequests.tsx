
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';

interface BookingWithDetails {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  total_price: number;
  created_at: string;
  venue: {
    id: string;
    name: string;
    location: string;
  };
  user: {
    id: string;
    email: string;
    username?: string;
  };
}

const AdminBookingRequests = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch bookings with venue and user information
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location),
          user:profiles(id, email:auth.users!id(email), username)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our BookingWithDetails interface
      const transformedData = data?.map(booking => ({
        ...booking,
        venue: booking.venue,
        user: {
          id: booking.user.id,
          email: booking.user.email?.[0]?.email || 'Unknown',
          username: booking.user.username
        }
      })) || [];
      
      setBookings(transformedData);
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
  
  const handleApprove = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Booking has been confirmed',
      });
      
      // Refresh the bookings list
      fetchBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve booking',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Booking has been cancelled',
      });
      
      // Refresh the bookings list
      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  };
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  return (
    <div>
      {loading ? (
        <div className="text-center py-8">Loading booking requests...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8">No booking requests found</div>
      ) : (
        <>
          <Table>
            <TableCaption>List of booking requests</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.venue.name}</TableCell>
                  <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.start_time} - {booking.end_time}</TableCell>
                  <TableCell>{booking.user.username || booking.user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Review the booking request information
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedBooking && (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold">Venue</h3>
                                  <p>{selectedBooking.venue.name}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Location</h3>
                                  <p>{selectedBooking.venue.location}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Date</h3>
                                  <p>{new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Time</h3>
                                  <p>{selectedBooking.start_time} - {selectedBooking.end_time}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">User</h3>
                                  <p>{selectedBooking.user.username || selectedBooking.user.email}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Status</h3>
                                  <Badge variant={getBadgeVariant(selectedBooking.status)}>
                                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                  </Badge>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Total Price</h3>
                                  <p>₹{selectedBooking.total_price}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Booking Created</h3>
                                  <p>{new Date(selectedBooking.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                              
                              {selectedBooking.notes && (
                                <div>
                                  <h3 className="font-semibold">Notes</h3>
                                  <p>{selectedBooking.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <DialogFooter className="mt-6">
                            {selectedBooking?.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => handleReject(selectedBooking.id)}
                                >
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => handleApprove(selectedBooking.id)}
                                >
                                  Approve
                                </Button>
                              </>
                            )}
                            <DialogClose asChild>
                              <Button variant="secondary">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleReject(booking.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleApprove(booking.id)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default AdminBookingRequests;
