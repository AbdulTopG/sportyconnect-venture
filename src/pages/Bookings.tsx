
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookings, useCancelBooking } from '@/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  IndianRupee, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

const Bookings = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, error } = useBookings();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  
  // Filter bookings by status
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (error) {
      return dateStr;
    }
  };
  
  // Format time for display (from "HH:MM:SS" to "HH:MM AM/PM")
  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return timeStr;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Handle booking cancellation
  const handleCancelBooking = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel);
      setBookingToCancel(null);
    }
  };
  
  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You need to be signed in to view your bookings.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 flex justify-center">
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
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
          <div className="mb-6">
            <Link to="/venues" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Venues
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground mt-1">
                Manage and view your venue bookings
              </p>
            </div>
          </div>
          
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load your bookings. Please try again.
              </AlertDescription>
            </Alert>
          )}
          
          {!isLoading && !error && bookings.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Bookings Found</CardTitle>
                <CardDescription>You haven't made any venue bookings yet.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/venues">
                  <Button>
                    Explore Venues
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && !error && bookings.length > 0 && (
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Upcoming ({pendingBookings.length + confirmedBookings.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({cancelledBookings.length + completedBookings.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Your pending and confirmed bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingBookings.length === 0 && confirmedBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">You don't have any upcoming bookings.</p>
                        <Link to="/venues">
                          <Button>Browse Venues</Button>
                        </Link>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Venue</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...pendingBookings, ...confirmedBookings].map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{booking.venue?.name || 'Unknown Venue'}</div>
                                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {booking.venue?.location || 'No location'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{formatDate(booking.booking_date)}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{booking.total_price}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(booking.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Link to={`/venues/${booking.venue_id}`}>
                                    <Button variant="outline" size="sm">View</Button>
                                  </Link>
                                  
                                  {booking.status === 'pending' && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="text-red-500 border-red-200 hover:bg-red-50"
                                          onClick={() => setBookingToCancel(booking.id)}
                                        >
                                          Cancel
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to cancel this booking? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setBookingToCancel(null)}>
                                            No, Keep It
                                          </AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={handleCancelBooking}
                                            disabled={isCancelling}
                                            className="bg-red-500 hover:bg-red-600"
                                          >
                                            {isCancelling && bookingToCancel === booking.id ? (
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : null}
                                            Yes, Cancel
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="past">
                <Card>
                  <CardHeader>
                    <CardTitle>Past Bookings</CardTitle>
                    <CardDescription>Your completed and cancelled bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedBookings.length === 0 && cancelledBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You don't have any past bookings.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Venue</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...completedBookings, ...cancelledBookings].map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{booking.venue?.name || 'Unknown Venue'}</div>
                                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {booking.venue?.location || 'No location'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{formatDate(booking.booking_date)}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{booking.total_price}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(booking.status)}
                              </TableCell>
                              <TableCell>
                                <Link to={`/venues/${booking.venue_id}`}>
                                  <Button variant="outline" size="sm">View Venue</Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Bookings;
