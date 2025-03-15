
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VenueRequest {
  id: string;
  name: string;
  location: string;
  description: string;
  price_per_hour: number;
  sports: string[];
  amenities: string[];
  contact_email: string;
  contact_phone: string;
  status: string;
  created_at: string;
  owner_id: string;
  owner?: {
    email?: string;
    username?: string;
  };
}

const AdminVenueRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<VenueRequest[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('venue_requests')
        .select(`
          *,
          owner:profiles(username, email:auth.users!id(email))
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRequests(data as VenueRequest[]);
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
    fetchRequests();
  }, []);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const handleApprove = async (request: VenueRequest) => {
    try {
      // Step 1: Create a new venue in the venues table
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: request.name,
          location: request.location,
          description: request.description,
          price_per_hour: request.price_per_hour,
          contact_email: request.contact_email,
          contact_phone: request.contact_phone,
          owner_id: request.owner_id,
          is_verified: true
        })
        .select()
        .single();
      
      if (venueError) throw venueError;
      
      // Step 2: Add sports for the venue
      const sportsToInsert = request.sports.map(sport => ({
        venue_id: venue.id,
        sport
      }));
      
      if (sportsToInsert.length > 0) {
        const { error: sportsError } = await supabase
          .from('venue_sports')
          .insert(sportsToInsert);
        
        if (sportsError) throw sportsError;
      }
      
      // Step 3: Add amenities for the venue
      const amenitiesToInsert = request.amenities.map(amenity => ({
        venue_id: venue.id,
        amenity
      }));
      
      if (amenitiesToInsert.length > 0) {
        const { error: amenitiesError } = await supabase
          .from('venue_amenities')
          .insert(amenitiesToInsert);
        
        if (amenitiesError) throw amenitiesError;
      }
      
      // Step 4: Update the status of the venue request
      const { error: updateError } = await supabase
        .from('venue_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);
      
      if (updateError) throw updateError;
      
      // Update the local state
      setRequests(requests.map(req => 
        req.id === request.id ? { ...req, status: 'approved' } : req
      ));
      
      toast({
        title: 'Venue Approved',
        description: 'The venue has been approved and listed successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error approving venue request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve venue request',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('venue_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Update the local state
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      ));
      
      toast({
        title: 'Venue Rejected',
        description: 'The venue request has been rejected',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error rejecting venue request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject venue request',
        variant: 'destructive',
      });
    }
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading venue requests...</div>;
  }
  
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No venue requests found.</p>
      </div>
    );
  }
  
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const otherRequests = requests.filter(req => req.status !== 'pending');
  
  return (
    <div className="space-y-6">
      {pendingRequests.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No pending venue requests.</p>
        </div>
      ) : (
        pendingRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{request.name}</CardTitle>
                  <CardDescription className="mt-1">{request.location}</CardDescription>
                </div>
                {renderStatusBadge(request.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p>₹{request.price_per_hour}/hour</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Owner</p>
                  <p>{request.owner?.username || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{request.owner?.email || 'No email'}</p>
                </div>
              </div>
              
              <Button
                variant="outline" 
                onClick={() => toggleExpand(request.id)}
                className="w-full flex items-center justify-center gap-1"
              >
                {expandedId === request.id ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Show More</span>
                  </>
                )}
              </Button>
              
              {expandedId === request.id && (
                <div className="mt-4 space-y-4">
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">
                      {request.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Sports</p>
                    <div className="flex flex-wrap gap-1">
                      {request.sports.map((sport, index) => (
                        <Badge key={index} variant="outline">{sport}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {request.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Contact Information</p>
                    <p className="text-sm text-muted-foreground">Email: {request.contact_email}</p>
                    <p className="text-sm text-muted-foreground">Phone: {request.contact_phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Request Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
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
                      <DialogTitle>Reject Venue Request</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reject this venue request? This action can't be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(request.id)}
                      >
                        Reject Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Venue Request</DialogTitle>
                      <DialogDescription>
                        Approving will create a new venue listing with all the details from this request.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={() => handleApprove(request)}
                      >
                        Approve and List
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
      
      {otherRequests.length > 0 && (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-medium mb-4">Processed Requests</h3>
          
          <div className="space-y-4">
            {otherRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{request.name}</CardTitle>
                      <CardDescription>{request.location}</CardDescription>
                    </div>
                    {renderStatusBadge(request.status)}
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

export default AdminVenueRequests;
