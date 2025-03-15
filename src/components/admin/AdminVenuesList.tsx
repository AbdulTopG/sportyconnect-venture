
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { VenueWithRelations } from '@/integrations/supabase/client';

const AdminVenuesList = () => {
  const { toast } = useToast();
  const [venues, setVenues] = useState<VenueWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<VenueWithRelations | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<string | null>(null);
  
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          sports:venue_sports(*),
          amenities:venue_amenities(*),
          images:venue_images(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast({
        title: 'Error',
        description: 'Failed to load venues',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVenues();
  }, []);
  
  const handleDeleteVenue = async () => {
    if (!venueToDelete) return;
    
    try {
      // Delete venue (cascade will handle related records)
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueToDelete);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Venue has been deleted',
      });
      
      setDeleteConfirmationOpen(false);
      setVenueToDelete(null);
      fetchVenues();
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete venue',
        variant: 'destructive',
      });
    }
  };
  
  const openDeleteConfirmation = (venueId: string) => {
    setVenueToDelete(venueId);
    setDeleteConfirmationOpen(true);
  };
  
  return (
    <div>
      {loading ? (
        <div className="text-center py-8">Loading venues...</div>
      ) : venues.length === 0 ? (
        <div className="text-center py-8">No venues found</div>
      ) : (
        <>
          <Table>
            <TableCaption>List of all venues</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price/Hour</TableHead>
                <TableHead>Sports</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell className="font-medium">{venue.name}</TableCell>
                  <TableCell>{venue.location}</TableCell>
                  <TableCell>₹{venue.price_per_hour}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {venue.sports?.slice(0, 2).map((sport) => (
                        <Badge key={sport.id} variant="outline">
                          {sport.sport}
                        </Badge>
                      ))}
                      {venue.sports && venue.sports.length > 2 && (
                        <Badge variant="outline">+{venue.sports.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedVenue(venue)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Venue Details</DialogTitle>
                            <DialogDescription>
                              Review the venue information
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedVenue && (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold">Name</h3>
                                  <p>{selectedVenue.name}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Location</h3>
                                  <p>{selectedVenue.location}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Price per Hour</h3>
                                  <p>₹{selectedVenue.price_per_hour}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Verified</h3>
                                  <Badge variant={selectedVenue.is_verified ? "success" : "outline"}>
                                    {selectedVenue.is_verified ? "Yes" : "No"}
                                  </Badge>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Contact Phone</h3>
                                  <p>{selectedVenue.contact_phone || 'Not provided'}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Contact Email</h3>
                                  <p>{selectedVenue.contact_email || 'Not provided'}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold">Description</h3>
                                <p>{selectedVenue.description || 'No description provided'}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold">Sports</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedVenue.sports?.map((sport) => (
                                      <Badge key={sport.id} variant="secondary">
                                        {sport.sport}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Amenities</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedVenue.amenities?.map((amenity) => (
                                      <Badge key={amenity.id} variant="outline">
                                        {amenity.amenity}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              {selectedVenue.images && selectedVenue.images.length > 0 && (
                                <div>
                                  <h3 className="font-semibold mb-2">Images</h3>
                                  <div className="grid grid-cols-3 gap-2">
                                    {selectedVenue.images.map((image) => (
                                      <img 
                                        key={image.id} 
                                        src={image.image_url} 
                                        alt={selectedVenue.name} 
                                        className="rounded-md h-32 w-full object-cover"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <DialogFooter className="mt-6">
                            <Link to={`/admin/edit-venue/${selectedVenue?.id}`}>
                              <Button variant="outline">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                setDeleteConfirmationOpen(true);
                                setVenueToDelete(selectedVenue?.id || null);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                            <DialogClose asChild>
                              <Button variant="secondary">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Link to={`/admin/edit-venue/${venue.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openDeleteConfirmation(venue.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Dialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this venue? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmationOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteVenue}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default AdminVenuesList;
