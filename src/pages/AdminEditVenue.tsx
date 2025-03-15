
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, ArrowLeft, Building, Loader2 } from 'lucide-react';

const AdminEditVenue = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Venue data
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [sports, setSports] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  
  // Available sports and amenities
  const availableSports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Swimming', 'Table Tennis', 'Volleyball'];
  const availableAmenities = ['Parking', 'Changing Rooms', 'Showers', 'Equipment Rental', 'Cafe', 'Floodlights', 'Seating', 'WiFi'];
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.role === 'admin') {
          setIsAdmin(true);
          fetchVenueData();
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Authentication Error",
          description: "Please try again later.",
          variant: "destructive",
        });
        navigate('/');
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, toast, id]);
  
  const fetchVenueData = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch venue details
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();
      
      if (venueError) throw venueError;
      
      if (!venue) {
        setError('Venue not found');
        return;
      }
      
      // Set venue basic details
      setName(venue.name);
      setLocation(venue.location);
      setDescription(venue.description || '');
      setPricePerHour(venue.price_per_hour.toString());
      setContactEmail(venue.contact_email || '');
      setContactPhone(venue.contact_phone || '');
      setIsVerified(venue.is_verified);
      
      // Fetch venue sports
      const { data: sportsData, error: sportsError } = await supabase
        .from('venue_sports')
        .select('sport')
        .eq('venue_id', id);
      
      if (sportsError) throw sportsError;
      setSports(sportsData.map(item => item.sport));
      
      // Fetch venue amenities
      const { data: amenitiesData, error: amenitiesError } = await supabase
        .from('venue_amenities')
        .select('amenity')
        .eq('venue_id', id);
      
      if (amenitiesError) throw amenitiesError;
      setAmenities(amenitiesData.map(item => item.amenity));
      
      // Fetch venue images
      const { data: imagesData, error: imagesError } = await supabase
        .from('venue_images')
        .select('image_url')
        .eq('venue_id', id);
      
      if (imagesError) throw imagesError;
      setImages(imagesData.map(item => item.image_url));
      
    } catch (error) {
      console.error('Error fetching venue details:', error);
      setError('Failed to load venue details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSportsToggle = (sport: string) => {
    setSports(
      sports.includes(sport)
        ? sports.filter(s => s !== sport)
        : [...sports, sport]
    );
  };
  
  const handleAmenitiesToggle = (amenity: string) => {
    setAmenities(
      amenities.includes(amenity)
        ? amenities.filter(a => a !== amenity)
        : [...amenities, amenity]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Validate inputs
      if (!name || !location || !pricePerHour) {
        setError('Please fill in all required fields');
        setIsSaving(false);
        return;
      }
      
      // Update venue in venues table
      const { error: venueError } = await supabase
        .from('venues')
        .update({
          name,
          location,
          description,
          price_per_hour: parseFloat(pricePerHour),
          contact_email: contactEmail || null,
          contact_phone: contactPhone || null,
          is_verified: isVerified,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (venueError) throw venueError;
      
      // Update sports - first delete existing
      const { error: deleteSportsError } = await supabase
        .from('venue_sports')
        .delete()
        .eq('venue_id', id);
      
      if (deleteSportsError) throw deleteSportsError;
      
      // Insert new sports
      if (sports.length > 0) {
        const sportsToInsert = sports.map(sport => ({
          venue_id: id,
          sport,
        }));
        
        const { error: insertSportsError } = await supabase
          .from('venue_sports')
          .insert(sportsToInsert);
        
        if (insertSportsError) throw insertSportsError;
      }
      
      // Update amenities - first delete existing
      const { error: deleteAmenitiesError } = await supabase
        .from('venue_amenities')
        .delete()
        .eq('venue_id', id);
      
      if (deleteAmenitiesError) throw deleteAmenitiesError;
      
      // Insert new amenities
      if (amenities.length > 0) {
        const amenitiesToInsert = amenities.map(amenity => ({
          venue_id: id,
          amenity,
        }));
        
        const { error: insertAmenitiesError } = await supabase
          .from('venue_amenities')
          .insert(amenitiesToInsert);
        
        if (insertAmenitiesError) throw insertAmenitiesError;
      }
      
      // Image handling would typically be here, but is more complex with storage
      // For now we'll skip adding new image functionality
      
      toast({
        title: "Venue Updated",
        description: "The venue has been updated successfully.",
      });
      
      navigate('/admin');
      
    } catch (error) {
      console.error('Error updating venue:', error);
      setError('Failed to update venue. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Button>
          
          <div className="flex items-center mb-6">
            <Building className="h-8 w-8 text-sportyfi-orange mr-3" />
            <h1 className="text-2xl font-bold">Edit Venue</h1>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-sportyfi-orange" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Edit Venue Details</CardTitle>
                <CardDescription>
                  Update the information for {name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Venue Name *</Label>
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input 
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pricePerHour">Price Per Hour (₹) *</Label>
                      <Input 
                        id="pricePerHour"
                        type="number"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="isVerified" className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          id="isVerified" 
                          checked={isVerified}
                          onCheckedChange={(checked) => setIsVerified(checked === true)}
                        />
                        <span>Mark as Verified</span>
                      </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input 
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Available Sports</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableSports.map((sport) => (
                        <div key={sport} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sport-${sport}`}
                            checked={sports.includes(sport)}
                            onCheckedChange={() => handleSportsToggle(sport)}
                          />
                          <Label htmlFor={`sport-${sport}`} className="cursor-pointer">
                            {sport}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`amenity-${amenity}`}
                            checked={amenities.includes(amenity)}
                            onCheckedChange={() => handleAmenitiesToggle(amenity)}
                          />
                          <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Image display - more complex image update would go here */}
                  {images.length > 0 && (
                    <div className="space-y-3">
                      <Label>Current Images</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {images.map((url, index) => (
                          <div key={index} className="aspect-square rounded-md overflow-hidden">
                            <img 
                              src={url} 
                              alt={`Venue image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/admin')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSaving}
                      className="bg-sportyfi-orange hover:bg-red-600"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminEditVenue;
