
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface VenueData {
  id: string;
  name: string;
  location: string;
  description: string;
  price_per_hour: number;
  contact_email: string;
  contact_phone: string;
  is_verified: boolean;
  sports?: { id: string; sport: string }[];
  amenities?: { id: string; amenity: string }[];
  images?: { id: string; image_url: string; is_primary: boolean }[];
}

const sports = [
  'Cricket', 'Football', 'Basketball', 'Tennis', 
  'Badminton', 'Volleyball', 'Swimming', 'Table Tennis'
];

const amenities = [
  'Parking', 'Changing Rooms', 'Washrooms', 'Cafeteria', 
  'Water Cooler', 'Seating', 'Floodlights', 'Equipment Rental'
];

const AdminEditVenue = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [venueData, setVenueData] = useState<VenueData>({
    id: '',
    name: '',
    location: '',
    description: '',
    price_per_hour: 0,
    contact_email: '',
    contact_phone: '',
    is_verified: false,
    sports: [],
    amenities: [],
    images: []
  });
  
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error || !data || data.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        fetchVenueData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };
    
    checkAdminStatus();
  }, [user, id]);
  
  const fetchVenueData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch venue details
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();
      
      if (venueError) throw venueError;
      
      // Fetch sports for this venue
      const { data: sports, error: sportsError } = await supabase
        .from('venue_sports')
        .select('id, sport')
        .eq('venue_id', id);
      
      if (sportsError) throw sportsError;
      
      // Fetch amenities for this venue
      const { data: amenities, error: amenitiesError } = await supabase
        .from('venue_amenities')
        .select('id, amenity')
        .eq('venue_id', id);
      
      if (amenitiesError) throw amenitiesError;
      
      // Fetch images for this venue
      const { data: images, error: imagesError } = await supabase
        .from('venue_images')
        .select('id, image_url, is_primary')
        .eq('venue_id', id);
      
      if (imagesError) throw imagesError;
      
      setVenueData({
        ...venue,
        sports,
        amenities,
        images
      });
      
      // Set selected sports and amenities
      setSelectedSports(sports.map(s => s.sport));
      setSelectedAmenities(amenities.map(a => a.amenity));
      
    } catch (error) {
      console.error('Error fetching venue data:', error);
      toast({
        title: "Error",
        description: "Failed to load venue data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update venue details
      const { error: venueError } = await supabase
        .from('venues')
        .update({
          name: venueData.name,
          location: venueData.location,
          description: venueData.description,
          price_per_hour: venueData.price_per_hour,
          contact_email: venueData.contact_email,
          contact_phone: venueData.contact_phone,
          is_verified: venueData.is_verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (venueError) throw venueError;
      
      // Delete existing sports and add new ones
      await supabase
        .from('venue_sports')
        .delete()
        .eq('venue_id', id);
      
      const sportsToInsert = selectedSports.map(sport => ({
        venue_id: id,
        sport
      }));
      
      if (sportsToInsert.length > 0) {
        const { error: sportsError } = await supabase
          .from('venue_sports')
          .insert(sportsToInsert);
        
        if (sportsError) throw sportsError;
      }
      
      // Delete existing amenities and add new ones
      await supabase
        .from('venue_amenities')
        .delete()
        .eq('venue_id', id);
      
      const amenitiesToInsert = selectedAmenities.map(amenity => ({
        venue_id: id,
        amenity
      }));
      
      if (amenitiesToInsert.length > 0) {
        const { error: amenitiesError } = await supabase
          .from('venue_amenities')
          .insert(amenitiesToInsert);
        
        if (amenitiesError) throw amenitiesError;
      }
      
      toast({
        title: "Venue Updated",
        description: "The venue has been updated successfully",
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Error updating venue:', error);
      toast({
        title: "Error",
        description: "Failed to update venue",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const toggleSport = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };
  
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading venue data...</span>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit Venue</CardTitle>
              <CardDescription>
                Update the details for {venueData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Venue Name</Label>
                      <Input 
                        id="name" 
                        value={venueData.name} 
                        onChange={(e) => setVenueData({...venueData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={venueData.location} 
                        onChange={(e) => setVenueData({...venueData, location: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price per Hour (₹)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        value={venueData.price_per_hour} 
                        onChange={(e) => setVenueData({...venueData, price_per_hour: Number(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Contact Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={venueData.contact_email} 
                        onChange={(e) => setVenueData({...venueData, contact_email: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input 
                        id="phone" 
                        value={venueData.contact_phone} 
                        onChange={(e) => setVenueData({...venueData, contact_phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox 
                        id="verified" 
                        checked={venueData.is_verified}
                        onCheckedChange={(checked) => 
                          setVenueData({...venueData, is_verified: checked as boolean})
                        }
                      />
                      <Label 
                        htmlFor="verified" 
                        className="cursor-pointer"
                      >
                        Mark as Verified
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={venueData.description || ''} 
                    onChange={(e) => setVenueData({...venueData, description: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Sports</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {sports.map((sport) => (
                      <div key={sport} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sport-${sport}`} 
                          checked={selectedSports.includes(sport)}
                          onCheckedChange={() => toggleSport(sport)}
                        />
                        <Label 
                          htmlFor={`sport-${sport}`} 
                          className="cursor-pointer"
                        >
                          {sport}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${amenity}`} 
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label 
                          htmlFor={`amenity-${amenity}`} 
                          className="cursor-pointer"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminEditVenue;
