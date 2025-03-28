
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { VenueWithRelations } from '@/integrations/supabase/client';

/**
 * Hook for fetching a single venue by ID with all related data
 */
export const useSingleVenueQuery = (venueId: string | undefined) => {
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
