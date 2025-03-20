
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, IndianRupee } from 'lucide-react';
import { VenueWithRelations } from '@/integrations/supabase/client';

interface VenueCardProps {
  venue: VenueWithRelations;
}

const VenueCard = ({ venue }: VenueCardProps) => {
  // Get primary image or fallback
  const primaryImage = venue.images?.find(img => img.is_primary)?.image_url 
    || venue.images?.[0]?.image_url 
    || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1305&q=80';

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={primaryImage} 
          alt={venue.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-sportyfi-orange">₹{venue.price_per_hour}/hr</Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 mb-2">{venue.name}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{venue.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {venue.sports?.slice(0, 3).map((sport) => (
            <Badge key={sport.id} variant="outline" className="bg-gray-100">
              {sport.sport}
            </Badge>
          ))}
          {venue.sports && venue.sports.length > 3 && (
            <Badge variant="outline" className="bg-gray-100">+{venue.sports.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link 
          to={`/venues/${venue.id}`}
          className="text-sportyfi-orange hover:text-red-600 font-medium text-sm"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VenueCard;
