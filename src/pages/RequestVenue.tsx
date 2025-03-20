import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Plus, X, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useSubmitVenueRequest } from '@/hooks/use-venues';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Available sports
const availableSports = [
  'Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 
  'Volleyball', 'Table Tennis', 'Swimming', 'Squash', 'Hockey'
];

// Available amenities
const availableAmenities = [
  'Parking', 'Changing Rooms', 'Washrooms', 'Seating', 'WiFi', 
  'Drinking Water', 'Equipment Rental', 'Floodlights', 'Cafeteria', 
  'Air Conditioning', 'First Aid'
];

const RequestVenue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: submitVenueRequest, isPending } = useSubmitVenueRequest();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customSport, setCustomSport] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Redirect if not logged in
  if (!user) {
    toast({
      title: 'Authentication required',
      description: 'You must be signed in to request a venue listing',
      variant: 'destructive',
    });
    navigate('/auth');
    return null;
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isPending) return;
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Venue name is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!pricePerHour.trim()) {
      newErrors.pricePerHour = 'Price per hour is required';
    } else if (isNaN(parseFloat(pricePerHour)) || parseFloat(pricePerHour) <= 0) {
      newErrors.pricePerHour = 'Price must be a positive number';
    }
    if (!contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }
    if (sports.length === 0) newErrors.sports = 'Please select at least one sport';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Submit venue request
    submitVenueRequest({
      name,
      description,
      location,
      pricePerHour: parseFloat(pricePerHour),
      contactPhone,
      contactEmail,
      sports,
      amenities,
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
      }
    });
  };
  
  // Handle sport toggle
  const toggleSport = (sport: string) => {
    setSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport) 
        : [...prev, sport]
    );
  };
  
  // Handle amenity toggle
  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };
  
  // Add custom sport
  const addCustomSport = () => {
    if (customSport.trim() && !sports.includes(customSport.trim())) {
      setSports(prev => [...prev, customSport.trim()]);
      setCustomSport('');
    }
  };
  
  // Add custom amenity
  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities(prev => [...prev, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };
  
  // Remove sport
  const removeSport = (sport: string) => {
    setSports(prev => prev.filter(s => s !== sport));
  };
  
  // Remove amenity
  const removeAmenity = (amenity: string) => {
    setAmenities(prev => prev.filter(a => a !== amenity));
  };
  
  // If submission is successful, show success message
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-lg w-full mx-auto p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold mb-3">Venue Request Submitted!</h1>
              
              <p className="text-muted-foreground mb-6">
                Thank you for submitting your venue for listing on SportyFi. Our team will review your request and get in touch with you soon.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/venues">
                  <Button variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Browse Venues
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button>Go to Home</Button>
                </Link>
              </div>
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
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <Link to="/venues" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Venues
              </Link>
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold">List Your Venue</h1>
              <p className="text-muted-foreground mt-2">
                Fill out the details below to submit your venue for listing on SportyFi. Our team will review your request and get in touch with you.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Venue Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Full address"
                        className={errors.location ? 'border-red-500' : ''}
                      />
                      {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your venue, facilities, rules, etc."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pricing & Contact</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pricePerHour">Price per Hour (₹) <span className="text-red-500">*</span></Label>
                      <Input
                        id="pricePerHour"
                        type="number"
                        min="0"
                        step="100"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        className={errors.pricePerHour ? 'border-red-500' : ''}
                      />
                      {errors.pricePerHour && <p className="text-sm text-red-500">{errors.pricePerHour}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone <span className="text-red-500">*</span></Label>
                      <Input
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className={errors.contactPhone ? 'border-red-500' : ''}
                      />
                      {errors.contactPhone && <p className="text-sm text-red-500">{errors.contactPhone}</p>}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contactEmail">Contact Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className={errors.contactEmail ? 'border-red-500' : ''}
                      />
                      {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail}</p>}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Sports & Amenities</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Sports Available <span className="text-red-500">*</span></Label>
                      
                      {errors.sports && <p className="text-sm text-red-500 mb-2">{errors.sports}</p>}
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        {availableSports.map((sport) => (
                          <div key={sport} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`sport-${sport}`} 
                              checked={sports.includes(sport)}
                              onCheckedChange={() => toggleSport(sport)}
                            />
                            <Label htmlFor={`sport-${sport}`} className="cursor-pointer">{sport}</Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {sports.map(sport => (
                          !availableSports.includes(sport) && (
                            <Badge 
                              key={sport} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {sport}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeSport(sport)}
                              />
                            </Badge>
                          )
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add other sport"
                          value={customSport}
                          onChange={(e) => setCustomSport(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={addCustomSport}
                          disabled={!customSport.trim()}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Amenities</Label>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        {availableAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`amenity-${amenity}`} 
                              checked={amenities.includes(amenity)}
                              onCheckedChange={() => toggleAmenity(amenity)}
                            />
                            <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">{amenity}</Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {amenities.map(amenity => (
                          !availableAmenities.includes(amenity) && (
                            <Badge 
                              key={amenity} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {amenity}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeAmenity(amenity)}
                              />
                            </Badge>
                          )
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add other amenity"
                          value={customAmenity}
                          onChange={(e) => setCustomAmenity(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={addCustomAmenity}
                          disabled={!customAmenity.trim()}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 -mx-8 -mb-8 px-8 py-6 mt-8">
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/venues')}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      isLoading={isPending}
                      loadingText="Submitting..."
                    >
                      Submit Venue Request
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RequestVenue;
