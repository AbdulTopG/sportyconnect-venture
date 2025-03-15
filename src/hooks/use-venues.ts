
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VenueWithRelations, VenueRequest } from '@/integrations/supabase/client';

// Fetch all venues with sports, amenities and images
export const useVenues = (filters?: {
  sportFilter?: string;
  locationFilter?: string;
  priceRange?: [number, number];
  searchQuery?: string;
}) => {
  return useQuery({
    queryKey: ['venues', filters],
    queryFn: async (): Promise<VenueWithRelations[]> => {
      // Start with the main query for venues
      let query = supabase
        .from('venues')
        .select(`
          *,
          sports:venue_sports(*),
          amenities:venue_amenities(*),
          images:venue_images(*)
        `)
        .eq('is_verified', true);

      // Apply filters if provided
      if (filters) {
        // Filter by sport
        if (filters.sportFilter && filters.sportFilter !== 'All Sports') {
          // This is a bit tricky since we need to filter based on a related table
          // We'll get all venues that have at least one sport matching the filter
          const { data: sportFilteredVenueIds } = await supabase
            .from('venue_sports')
            .select('venue_id')
            .eq('sport', filters.sportFilter);
          
          if (sportFilteredVenueIds?.length) {
            const venueIds = sportFilteredVenueIds.map(v => v.venue_id);
            query = query.in('id', venueIds);
          } else {
            // No venues match this sport filter
            return [];
          }
        }

        // Filter by location
        if (filters.locationFilter && filters.locationFilter !== 'All Locations') {
          query = query.ilike('location', `%${filters.locationFilter}%`);
        }

        // Filter by price range
        if (filters.priceRange) {
          query = query
            .gte('price_per_hour', filters.priceRange[0])
            .lte('price_per_hour', filters.priceRange[1]);
        }

        // Filter by search query (search in name, description, and location)
        if (filters.searchQuery) {
          query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching venues:', error);
        throw new Error('Failed to fetch venues');
      }

      return data || [];
    },
  });
};

// Fetch a single venue by ID with all related data
export const useVenue = (venueId: string | undefined) => {
  return useQuery({
    queryKey: ['venue', venueId],
    queryFn: async (): Promise<VenueWithRelations | null> => {
      if (!venueId) return null;

      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          sports:venue_sports(*),
          amenities:venue_amenities(*),
          images:venue_images(*)
        `)
        .eq('id', venueId)
        .single();

      if (error) {
        console.error('Error fetching venue:', error);
        throw new Error('Failed to fetch venue');
      }

      return data;
    },
    enabled: !!venueId,
  });
};

// Submit a venue request
export interface VenueRequestFormData {
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  contactPhone: string;
  contactEmail: string;
  sports: string[];
  amenities: string[];
}

export const useSubmitVenueRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: VenueRequestFormData) => {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('You must be logged in to submit a venue request');
      }

      const { data, error } = await supabase
        .from('venue_requests')
        .insert({
          name: formData.name,
          description: formData.description,
          location: formData.location,
          price_per_hour: formData.pricePerHour,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          sports: formData.sports,
          amenities: formData.amenities,
          owner_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting venue request:', error);
        throw new Error('Failed to submit venue request');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Venue request submitted',
        description: 'Your request has been submitted and is pending approval',
      });
      queryClient.invalidateQueries({ queryKey: ['venue_requests'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit venue request',
        variant: 'destructive',
      });
    }
  });
};

// Get user's venue requests
export const useVenueRequests = () => {
  return useQuery({
    queryKey: ['venue_requests'],
    queryFn: async (): Promise<VenueRequest[]> => {
      const { data, error } = await supabase
        .from('venue_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching venue requests:', error);
        throw new Error('Failed to fetch venue requests');
      }

      return data || [];
    },
  });
};
