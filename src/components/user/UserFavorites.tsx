
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, IndianRupee, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Define a simpler interface for favorites
interface VenueImage {
  image_url: string;
}

interface VenueSport {
  sport: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  images?: VenueImage[];
  sports?: VenueSport[];
}

interface FavoriteVenue {
  id: string;
  venue_id: string;
  user_id: string;
  created_at: string;
  venue: Venue;
}

const UserFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteVenue[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('venue_favorites')
        .select(`
          id,
          venue_id,
          user_id,
          created_at,
          venue:venues(
            id, 
            name, 
            location,
            price_per_hour,
            images:venue_images(image_url),
            sports:venue_sports(sport)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setFavorites(data as FavoriteVenue[]);
      }
    } catch (error) {
      console.error('Error fetching favorite venues:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorite venues',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFavorites();
  }, [user]);
  
  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('venue_favorites')
        .delete()
        .eq('id', favoriteId);
      
      if (error) throw error;
      
      // Update the local state
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      
      toast({
        title: 'Venue Removed',
        description: 'The venue has been removed from your favorites',
      });
    } catch (error) {
      console.error('Error removing favorite venue:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove venue from favorites',
        variant: 'destructive',
      });
    }
  };
  
  const getVenueImage = (venue: FavoriteVenue['venue']) => {
    if (venue.images && venue.images.length > 0) {
      return venue.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80';
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading your favorite venues...</div>;
  }
  
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Heart className="h-12 w-12 mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No favorite venues yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't added any venues to your favorites yet.
        </p>
        <Link to="/venues">
          <Button>Browse Venues</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((favorite) => (
        <Card key={favorite.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-40">
            <img 
              src={getVenueImage(favorite.venue)} 
              alt={favorite.venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove from Favorites</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove "{favorite.venue.name}" from your favorites?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => removeFavorite(favorite.id)}
                    >
                      Remove
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{favorite.venue.name}</h3>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{favorite.venue.location}</span>
            </div>
            <div className="flex items-center text-muted-foreground mb-3">
              <IndianRupee className="h-4 w-4 mr-1" />
              <span className="text-sm">₹{favorite.venue.price_per_hour}/hour</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {favorite.venue.sports?.slice(0, 3).map((sport, index) => (
                <Badge key={index} variant="outline">
                  {sport.sport}
                </Badge>
              ))}
              {favorite.venue.sports && favorite.venue.sports.length > 3 && (
                <Badge variant="outline">+{favorite.venue.sports.length - 3}</Badge>
              )}
            </div>
            
            <Link to={`/venues/${favorite.venue.id}`}>
              <Button className="w-full">View Details</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserFavorites;
