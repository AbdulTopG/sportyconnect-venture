
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pencil, Trash2, MapPin, Search, CheckCircle, XCircle } from 'lucide-react';
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
  price_per_hour: number;
  is_verified: boolean;
  sports?: { id: string; sport: string }[];
  images?: { id: string; image_url: string }[];
}

const AdminVenuesList = () => {
  const { toast } = useToast();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchVenues = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          sports:venue_sports(id, sport),
          images:venue_images(id, image_url)
        `)
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setVenues(data as Venue[]);
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
  
  const deleteVenue = async (venueId: string) => {
    try {
      // Delete associated records first (cascade delete may not be set up)
      await supabase.from('venue_sports').delete().eq('venue_id', venueId);
      await supabase.from('venue_amenities').delete().eq('venue_id', venueId);
      await supabase.from('venue_images').delete().eq('venue_id', venueId);
      
      // Delete the venue itself
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);
      
      if (error) throw error;
      
      // Update the local state
      setVenues(venues.filter(venue => venue.id !== venueId));
      
      toast({
        title: 'Venue Deleted',
        description: 'The venue has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete venue',
        variant: 'destructive',
      });
    }
  };
  
  const toggleVerification = async (venue: Venue) => {
    try {
      const { error } = await supabase
        .from('venues')
        .update({ is_verified: !venue.is_verified })
        .eq('id', venue.id);
      
      if (error) throw error;
      
      // Update the local state
      setVenues(venues.map(v => 
        v.id === venue.id ? { ...v, is_verified: !venue.is_verified } : v
      ));
      
      toast({
        title: venue.is_verified ? 'Venue Unverified' : 'Venue Verified',
        description: `The venue has been ${venue.is_verified ? 'unverified' : 'verified'} successfully`,
      });
    } catch (error) {
      console.error('Error updating venue verification status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update venue verification status',
        variant: 'destructive',
      });
    }
  };
  
  const filteredVenues = venues.filter(venue => 
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getVenueImage = (venue: Venue) => {
    if (venue.images && venue.images.length > 0) {
      return venue.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80';
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading venues...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search venues by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredVenues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? 'No venues match your search.' : 'No venues found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden">
              <div className="h-40 relative">
                <img 
                  src={getVenueImage(venue)} 
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant={venue.is_verified ? "outline" : "outline"}
                    size="icon"
                    className={`h-8 w-8 rounded-full ${venue.is_verified ? 'bg-green-100' : 'bg-red-100'}`}
                    onClick={() => toggleVerification(venue)}
                  >
                    {venue.is_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-800" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-800" />
                    )}
                  </Button>
                </div>
              </div>
              
              <CardHeader className="p-4">
                <div className="space-y-1">
                  <h3 className="font-semibold">{venue.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{venue.location}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-4 pb-4 pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-medium ml-1">₹{venue.price_per_hour}/hr</span>
                  </div>
                  <Badge variant={venue.is_verified ? "outline" : "outline"} className={venue.is_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {venue.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {venue.sports?.slice(0, 3).map((sport) => (
                    <Badge key={sport.id} variant="secondary" className="bg-gray-100">
                      {sport.sport}
                    </Badge>
                  ))}
                  {venue.sports && venue.sports.length > 3 && (
                    <Badge variant="secondary" className="bg-gray-100">+{venue.sports.length - 3}</Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/admin/edit-venue/${venue.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Venue</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{venue.name}"? This action cannot be undone and will remove all associated data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => deleteVenue(venue.id)}
                        >
                          Delete Venue
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVenuesList;
