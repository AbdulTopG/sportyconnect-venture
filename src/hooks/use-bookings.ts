
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Booking, Venue } from '@/integrations/supabase/client';

export interface BookingFormData {
  venueId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

// Get all bookings for the current user
export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async (): Promise<(Booking & { venue: Venue | null })[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(*)
        `)
        .order('booking_date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw new Error('Failed to fetch bookings');
      }

      return data || [];
    },
  });
};

// Create a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: BookingFormData) => {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('You must be logged in to book a venue');
      }
      
      // Fetch the venue to get price
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .select('price_per_hour')
        .eq('id', formData.venueId)
        .single();
        
      if (venueError || !venue) {
        throw new Error('Failed to fetch venue details');
      }
      
      // Calculate hours between start and end time
      const startHour = parseInt(formData.startTime.split(':')[0]);
      const startMinute = parseInt(formData.startTime.split(':')[1]);
      const endHour = parseInt(formData.endTime.split(':')[0]);
      const endMinute = parseInt(formData.endTime.split(':')[1]);
      
      const startTimeMinutes = startHour * 60 + startMinute;
      const endTimeMinutes = endHour * 60 + endMinute;
      const durationHours = (endTimeMinutes - startTimeMinutes) / 60;
      
      // Calculate total price
      const totalPrice = venue.price_per_hour * durationHours;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          venue_id: formData.venueId,
          user_id: user.id,
          booking_date: formData.bookingDate.toISOString().split('T')[0],
          start_time: formData.startTime + ':00',
          end_time: formData.endTime + ':00',
          status: 'pending',
          total_price: totalPrice,
          notes: formData.notes || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Booking request submitted',
        description: 'Your booking request has been sent to the venue owner for confirmation.',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create booking',
        variant: 'destructive',
      });
    }
  });
};

// Cancel a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling booking:', error);
        throw new Error('Failed to cancel booking');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been cancelled successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  });
};
