
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Card, CardContent,
  Badge,
  Button,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Separator
} from '@/components/ui';
import { 
  MapPin, 
  Mail, 
  Phone, 
  IndianRupee,
  Check,
  X
} from 'lucide-react';

interface VenueRequest {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price_per_hour: number;
  contact_phone: string;
  contact_email: string;
  sports: string[];
  amenities: string[];
  owner_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  owner?: {
    username: string | null;
    email: string | null;
  };
}

const AdminVenueRequests = () => {
  const { toast } = useToast();
  const [venueRequests, setVenueRequests] = useState<VenueRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchVenueRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('venue_requests')
        .select(`
          *,
          owner:profiles(username)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setVenueRequests(data as unknown as VenueRequest[]);
      
    } catch (error) {
      console.error('Error fetching venue requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load venue requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenueRequests();
  }, []);

  const approveVenueRequest = async (request: VenueRequest) => {
    try {
      setProcessingId(request.id);
      
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: request.name,
          description: request.description,
          location: request.location,
          price_per_hour: request.price_per_hour,
          contact_email: request.contact_email,
          contact_phone: request.contact_phone,
          owner_id: request.owner_id,
          is_verified: true
        })
        .select()
        .single();

      if (venueError) throw venueError;
      
      if (request.sports.length > 0) {
        const sportsToInsert = request.sports.map(sport => ({
          venue_id: venueData.id,
          sport
        }));
        
        const { error: sportsError } = await supabase
          .from('venue_sports')
          .insert(sportsToInsert);
          
        if (sportsError) throw sportsError;
      }
      
      if (request.amenities.length > 0) {
        const amenitiesToInsert = request.amenities.map(amenity => ({
          venue_id: venueData.id,
          amenity
        }));
        
        const { error: amenitiesError } = await supabase
          .from('venue_amenities')
          .insert(amenitiesToInsert);
          
        if (amenitiesError) throw amenitiesError;
      }
      
      const { error: updateError } = await supabase
        .from('venue_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);
        
      if (updateError) throw updateError;

      setVenueRequests(prev => 
        prev.filter(req => req.id !== request.id)
      );

      toast({
        title: 'Venue Request Approved',
        description: `${request.name} has been added to venues.`
      });

    } catch (error) {
      console.error('Error approving venue request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve venue request',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const rejectVenueRequest = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      
      const { error } = await supabase
        .from('venue_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      setVenueRequests(prev => 
        prev.filter(req => req.id !== requestId)
      );

      toast({
        title: 'Venue Request Rejected',
        description: 'The venue request has been rejected.'
      });
    } catch (error) {
      console.error('Error rejecting venue request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject venue request',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sportyfi-orange"></div>
      </div>
    );
  }

  if (venueRequests.length === 0) {
    return (
      <Card className="border-dashed bg-muted/50">
        <div className="flex flex-col items-center justify-center py-10">
          <MapPin className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-lg mb-1">No pending venue requests</p>
          <p className="text-muted-foreground text-sm">All venue requests have been processed</p>
        </div>
      </Card>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {venueRequests.map((request) => (
        <AccordionItem 
          key={request.id} 
          value={request.id}
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <div className="flex flex-col items-start text-left">
              <div className="font-medium">{request.name}</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {request.location}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {request.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Price</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <IndianRupee className="h-3 w-3 mr-1" />
                  {request.price_per_hour} per hour
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Contact</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {request.contact_email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {request.contact_phone}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Requested By</h4>
                  <p className="text-sm text-muted-foreground">
                    {request.owner?.username || 'Unknown User'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(request.created_at), 'PPP')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Sports</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.sports.map((sport, index) => (
                      <Badge key={index} variant="outline">
                        {sport}
                      </Badge>
                    ))}
                    {request.sports.length === 0 && (
                      <span className="text-sm text-muted-foreground">None specified</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                    {request.amenities.length === 0 && (
                      <span className="text-sm text-muted-foreground">None specified</span>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => rejectVenueRequest(request.id)}
                  disabled={processingId === request.id}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => approveVenueRequest(request)}
                  disabled={processingId === request.id}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AdminVenueRequests;
