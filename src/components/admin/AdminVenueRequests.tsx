
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
import type { VenueRequest } from '@/integrations/supabase/client';

const AdminVenueRequests = () => {
  const { toast } = useToast();
  const [venueRequests, setVenueRequests] = useState<VenueRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VenueRequest | null>(null);
  
  const fetchVenueRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('venue_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVenueRequests(data || []);
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
  
  const handleApprove = async (requestId: string) => {
    try {
      const request = venueRequests.find(req => req.id === requestId);
      if (!request) return;
      
      // 1. Create the new venue
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: request.name,
          description: request.description,
          location: request.location,
          price_per_hour: request.price_per_hour,
          contact_phone: request.contact_phone,
          contact_email: request.contact_email,
          owner_id: request.owner_id,
          is_verified: true
        })
        .select()
        .single();
      
      if (venueError) throw venueError;
      
      // 2. Add sports
      if (request.sports && request.sports.length > 0) {
        const sportsToInsert = request.sports.map(sport => ({
          venue_id: venueData.id,
          sport: sport
        }));
        
        const { error: sportsError } = await supabase
          .from('venue_sports')
          .insert(sportsToInsert);
        
        if (sportsError) throw sportsError;
      }
      
      // 3. Add amenities
      if (request.amenities && request.amenities.length > 0) {
        const amenitiesToInsert = request.amenities.map(amenity => ({
          venue_id: venueData.id,
          amenity: amenity
        }));
        
        const { error: amenitiesError } = await supabase
          .from('venue_amenities')
          .insert(amenitiesToInsert);
        
        if (amenitiesError) throw amenitiesError;
      }
      
      // 4. Update request status
      const { error: updateError } = await supabase
        .from('venue_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Success',
        description: 'Venue has been approved and added to the system',
      });
      
      fetchVenueRequests();
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
      
      toast({
        title: 'Success',
        description: 'Venue request has been rejected',
      });
      
      fetchVenueRequests();
    } catch (error) {
      console.error('Error rejecting venue request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject venue request',
        variant: 'destructive',
      });
    }
  };
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  return (
    <div>
      {loading ? (
        <div className="text-center py-8">Loading venue requests...</div>
      ) : venueRequests.length === 0 ? (
        <div className="text-center py-8">No venue requests found</div>
      ) : (
        <>
          <Table>
            <TableCaption>List of venue listing requests</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price/Hour</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venueRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>₹{request.price_per_hour}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Venue Request Details</DialogTitle>
                            <DialogDescription>
                              Review the venue request information
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedRequest && (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold">Name</h3>
                                  <p>{selectedRequest.name}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Location</h3>
                                  <p>{selectedRequest.location}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Price per Hour</h3>
                                  <p>₹{selectedRequest.price_per_hour}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Status</h3>
                                  <Badge variant={getBadgeVariant(selectedRequest.status)}>
                                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                  </Badge>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Contact Phone</h3>
                                  <p>{selectedRequest.contact_phone}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Contact Email</h3>
                                  <p>{selectedRequest.contact_email}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold">Description</h3>
                                <p>{selectedRequest.description || 'No description provided'}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold">Sports</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedRequest.sports.map((sport, index) => (
                                      <Badge key={index} variant="secondary">
                                        {sport}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Amenities</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedRequest.amenities.map((amenity, index) => (
                                      <Badge key={index} variant="outline">
                                        {amenity}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <DialogFooter className="mt-6">
                            {selectedRequest?.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => handleReject(selectedRequest.id)}
                                >
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => handleApprove(selectedRequest.id)}
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
                      
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleApprove(request.id)}
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

export default AdminVenueRequests;
