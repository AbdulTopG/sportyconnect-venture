
// Main barrel file that re-exports all venue-related hooks

import { useVenuesQuery, type VenueFilters } from './venues/use-venues-query';
import { useSingleVenueQuery } from './venues/use-single-venue-query';
import { 
  useVenueRequests, 
  useSubmitVenueRequest,
  type VenueRequestFormData 
} from './venues/use-venue-requests';
import { dummyVenues } from './venues/venue-mock-data';

// Re-export everything for backward compatibility
export { 
  useVenuesQuery,
  useSingleVenueQuery,
  useVenueRequests,
  useSubmitVenueRequest,
  dummyVenues,
  type VenueFilters,
  type VenueRequestFormData
};

// Main hook for venues - this is the one most components will use
export const useVenues = useVenuesQuery;
export const useVenue = useSingleVenueQuery;
