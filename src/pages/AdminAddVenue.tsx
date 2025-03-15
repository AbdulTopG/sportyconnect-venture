
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { PlusCircle, X, ArrowLeft, ImagePlus } from 'lucide-react';

const sportOptions = [
  'Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 
  'Volleyball', 'Table Tennis', 'Swimming', 'Snooker', 'Kabaddi'
];

const amenityOptions = [
  'Parking', 'Floodlights', 'Changing Rooms', 'Restrooms', 'Showers', 
  'Seating Area', 'Cafeteria', 'Equipment Rental', 'Coaching', 'Locker Room'
];

const AdminAddVenue = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price_per_hour: 0,
    contact_phone: '',
    contact_email: '',
  });
  
  // Additional state for sports and amenities
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle sport selection
  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };
  
  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  
  // Add image URL
  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl('');
    }
  };
  
  // Remove image URL
  const removeImageUrl = (url: string) => {
    setImageUrls(imageUrls.filter(imageUrl => imageUrl !== url));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || formData.price_per_hour <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // 1. Insert venue
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          price_per_hour: formData.price_per_hour,
          contact_phone: formData.contact_phone || null,
          contact_email: formData.contact_email || null,
          is_verified: true
        })
        .select()
        .single();
      
      if (venueError) throw venueError;
      
      // 2. Insert sports
      if (selectedSports.length > 0) {
        const sportsToInsert = selectedSports.map(sport => ({
          venue_id: venueData.id,
          sport
        }));
        
        const { error: sportsError } = await supabase
          .from('venue_sports')
          .insert(sportsToInsert);
        
        if (sportsError) throw sportsError;
      }
      
      // 3. Insert amenities
      if (selectedAmenities.length > 0) {
        const amenitiesToInsert = selectedAmenities.map(amenity => ({
          venue_id: venueData.id,
          amenity
        }));
        
        const { error: amenitiesError } = await supabase
          .from('venue_amenities')
          .insert(amenitiesToInsert);
        
        if (amenitiesError) throw amenitiesError;
      }
      
      // 4. Insert images
      if (imageUrls.length > 0) {
        const imagesToInsert = imageUrls.map((imageUrl, index) => ({
          venue_id: venueData.id,
          image_url: imageUrl,
          is_primary: index === 0 // First image is primary
        }));
        
        const { error: imagesError } = await supabase
          .from('venue_images')
          .insert(imagesToInsert);
        
        if (imagesError) throw imagesError;
      }
      
      toast({
        title: 'Success',
        description: 'Venue added successfully',
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Error adding venue:', error);
      toast({
        title: 'Error',
        description: 'Failed to add venue',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Add New Venue</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Venue Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price_per_hour">Price per Hour (₹) *</Label>
                  <Input
                    id="price_per_hour"
                    name="price_per_hour"
                    type="number"
                    min="0"
                    value={formData.price_per_hour}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Sports</h2>
              <div className="flex flex-wrap gap-2">
                {sportOptions.map(sport => (
                  <Badge
                    key={sport}
                    variant={selectedSports.includes(sport) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSport(sport)}
                  >
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map(amenity => (
                  <Badge
                    key={amenity}
                    variant={selectedAmenities.includes(amenity) ? 'secondary' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Images</h2>
              
              <div className="flex items-center gap-2 mb-4">
                <Input
                  placeholder="Enter image URL"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={addImageUrl}
                  variant="outline"
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`Venue image ${index+1}`} 
                        className="h-36 w-full object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon"
                          onClick={() => removeImageUrl(url)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 bg-sportyfi-orange">
                          Primary
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-md">
                  <ImagePlus className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No images added yet</p>
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                Cancel
              </Button>
              <Button type="submit">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminAddVenue;
