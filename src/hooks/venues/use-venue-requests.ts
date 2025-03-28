
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VenueRequest } from '@/integrations/supabase/client';

/**
 * Hook for fetching venue requests
 */
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

/**
 * Form data interface for venue requests
 */
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

/**
 * Hook for submitting new venue requests
 */
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
