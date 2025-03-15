
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Check, X, MapPin, User, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface Venue {
  id: string;
  name: string;
  location: string;
}

interface BookingRequest {
  id: string;
  user_id: string;
  venue_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  notes: string | null;
  created_at: string;
  venue: Venue;
  user: User;
}

const AdminBookingRequests = () => {
  const { toast } = useToast();
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchBookingRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location),
          user:profiles(id, username, avatar_url)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Use type assertion to fix the TypeScript error
        setBookingRequests(data as unknown as BookingRequest[]);
      }
    } catch (error) {
      console.error('Error fetching booking requests:', error);
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
    fetchBookingRequests();
  }, []);

  const updateBookingStatus = async (bookingId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingIds(prev => new Set(prev).add(bookingId));
      
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookingRequests(prev => 
        prev.filter(booking => booking.id !== bookingId)
      );

      toast({
        title: `Booking ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The booking has been ${status}.`,
      });
    } catch (error) {
      console.error(`Error ${status} booking:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${status} booking`,
        variant: 'destructive',
      });
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(bookingId);
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sportyfi-orange"></div>
      </div>
    );
  }

  if (bookingRequests.length === 0) {
    return (
      <Card className="border-dashed bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <CalendarClock className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-lg mb-1">No pending booking requests</p>
          <p className="text-muted-foreground text-sm">All booking requests have been processed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Venue</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookingRequests.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>
              <div>
                <div className="font-medium">{booking.venue.name}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {booking.venue.location}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                {booking.user.username || 'Anonymous'}
              </div>
            </TableCell>
            <TableCell>
              <div className="whitespace-nowrap">
                {format(new Date(booking.booking_date), 'MMM d, yyyy')}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {booking.start_time} to {booking.end_time}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <IndianRupee className="h-3 w-3 mr-1" />
                {booking.total_price}
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-[200px] truncate">
                {booking.notes || '-'}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateBookingStatus(booking.id, 'approved')}
                  disabled={processingIds.has(booking.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateBookingStatus(booking.id, 'rejected')}
                  disabled={processingIds.has(booking.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminBookingRequests;
