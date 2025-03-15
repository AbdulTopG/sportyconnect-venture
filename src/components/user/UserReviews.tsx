
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquare, MapPin, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VenueImage {
  image_url: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  images?: VenueImage[];
}

interface UserReview {
  id: string;
  user_id: string;
  venue_id: string;
  rating: number;
  comment: string;
  created_at: string;
  venue: Venue;
}

const UserReviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchReviews = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('venue_reviews')
        .select(`
          id,
          user_id,
          venue_id,
          rating,
          comment,
          created_at,
          venue:venues(
            id, 
            name, 
            location,
            images:venue_images(image_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setReviews(data as UserReview[]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [user]);
  
  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('venue_reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      
      // Update the local state
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      toast({
        title: 'Review Deleted',
        description: 'Your review has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };
  
  const getVenueImage = (venue: UserReview['venue']) => {
    if (venue.images && venue.images.length > 0) {
      return venue.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80';
  };
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading your reviews...</div>;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't written any reviews for venues yet.
        </p>
        <Link to="/venues">
          <Button>Browse Venues</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 h-40">
              <img 
                src={getVenueImage(review.venue)} 
                alt={review.venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-4 flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{review.venue.name}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{review.venue.location}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-muted-foreground text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3 md:mt-0">
                  <Link to={`/venues/${review.venue.id}?editReview=${review.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete your review for "{review.venue.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => deleteReview(review.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
              
              <div className="mt-3">
                <Link to={`/venues/${review.venue.id}`}>
                  <Button variant="link" className="px-0">
                    View Venue
                  </Button>
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserReviews;
