
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVenue } from '@/hooks/use-venues';
import { useCreateBooking } from '@/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  IndianRupee,
  Info,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00'
];

const bookingFormSchema = z.object({
  bookingDate: z.date({
    required_error: "Please select a date for your booking",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }).refine(val => val !== '', {
    message: "Please select an end time",
  }),
  notes: z.string().optional(),
}).refine(data => {
  const start = parseInt(data.startTime.split(':')[0]);
  const end = parseInt(data.endTime.split(':')[0]);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const VenueDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Image gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Booking dialog
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Get venue data
  const { data: venue, isLoading, error } = useVenue(id);
  
  // Create booking mutation
  const { mutate: createBooking, isPending: isBookingPending } = useCreateBooking();
  
  // Form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      notes: '',
    },
  });
  
  // Handle booking submit
  const onSubmit = (values: BookingFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to book this venue',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    if (!id) return;
    
    createBooking({
      venueId: id,
      bookingDate: values.bookingDate,
      startTime: values.startTime,
      endTime: values.endTime,
      notes: values.notes,
    }, {
      onSuccess: () => {
        setIsBookingOpen(false);
        form.reset();
      }
    });
  };
  
  // Handle gallery navigation
  const nextImage = () => {
    if (!venue?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };
  
  const prevImage = () => {
    if (!venue?.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
  };
  
  // Fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80';
  
  // Current image URL
  const currentImage = venue?.images?.length 
    ? venue.images[currentImageIndex].image_url 
    : defaultImage;
  
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow">
        {isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-96 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load venue details. The venue might not exist or has been removed.
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Link to="/venues">
                <Button>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Venues
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {venue && (
          <div className="bg-white">
            <div className="relative h-96 md:h-[500px] bg-gray-200">
              <img 
                src={currentImage}
                alt={venue.name} 
                className="w-full h-full object-cover"
              />
              
              {venue.images && venue.images.length > 1 && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {venue.images.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      ></div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold">{venue.name}</h1>
                  <div className="flex items-center text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{venue.location}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-sportyfi-orange hover:bg-red-600">
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Book {venue.name}</DialogTitle>
                        <DialogDescription>
                          Select your preferred date and time for booking this venue.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                          <FormField
                            control={form.control}
                            name="bookingDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                                  initialFocus
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex gap-4">
                            <FormField
                              control={form.control}
                              name="startTime"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Start Time</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select start time" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {timeSlots.map((time) => (
                                        <SelectItem key={`start-${time}`} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="endTime"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>End Time</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select end time" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {timeSlots.map((time) => (
                                        <SelectItem 
                                          key={`end-${time}`} 
                                          value={time}
                                          disabled={time <= form.watch('startTime')}
                                        >
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes (optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Any special requirements or information"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Add any additional information for the venue.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {!user && (
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertTitle>Authentication required</AlertTitle>
                              <AlertDescription>
                                You need to be signed in to book this venue.
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              disabled={isBookingPending || !user}
                            >
                              {isBookingPending ? 'Submitting...' : 'Book Venue'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">About this Venue</h2>
                    <p className="text-muted-foreground">
                      {venue.description || 'No description provided.'}
                    </p>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-semibold mb-4">Sports</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {venue.sports && venue.sports.length > 0 ? (
                        venue.sports.map((sport) => (
                          <Badge key={sport.id} variant="outline">
                            {sport.sport}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No sports information available</p>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities && venue.amenities.length > 0 ? (
                        venue.amenities.map((amenity) => (
                          <Badge key={amenity.id} variant="secondary">
                            {amenity.amenity}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No amenities information available</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <div className="font-semibold">Price</div>
                          <div className="text-sm text-muted-foreground">₹{venue.price_per_hour} per hour</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <div className="font-semibold">Operating Hours</div>
                          <div className="text-sm text-muted-foreground">6:00 AM - 11:00 PM</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <div className="font-semibold">Booking Policy</div>
                          <div className="text-sm text-muted-foreground">Book up to 60 days in advance</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Contact</h2>
                    
                    <div className="space-y-4">
                      {venue.contact_phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">Phone</div>
                            <div className="text-sm text-muted-foreground">{venue.contact_phone}</div>
                          </div>
                        </div>
                      )}
                      
                      {venue.contact_email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">Email</div>
                            <div className="text-sm text-muted-foreground">{venue.contact_email}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <div className="font-semibold">Address</div>
                          <div className="text-sm text-muted-foreground">{venue.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default VenueDetail;
