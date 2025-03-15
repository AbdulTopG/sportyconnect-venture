
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVenues, dummyVenues } from '@/hooks/use-venues';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import VenueCard from '@/components/venues/VenueCard';
import VenueFilter, { VenueFilterValues } from '@/components/venues/VenueFilter';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Venues = () => {
  // Filters state
  const [filters, setFilters] = useState<{
    sportFilter: string;
    locationFilter: string;
    priceRange: [number, number];
    searchQuery: string;
  }>({
    sportFilter: 'All Sports',
    locationFilter: 'All Locations',
    priceRange: [0, 5000],
    searchQuery: '',
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Auth context
  const { user } = useAuth();
  
  // Fetch venues with filters
  const { data: venues = [], isLoading, error } = useVenues(filters);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: VenueFilterValues) => {
    setFilters({
      sportFilter: newFilters.sport,
      locationFilter: newFilters.location,
      priceRange: newFilters.priceRange,
      searchQuery: newFilters.searchQuery,
    });
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Get venues to display - use real venues or dummy venues if none are found
  const venuesToDisplay = venues.length > 0 ? venues : dummyVenues;
  
  // Calculate pagination
  const totalPages = Math.ceil(venuesToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVenues = venuesToDisplay.slice(startIndex, startIndex + itemsPerPage);
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // First page is always shown
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // If there are many pages, show ellipsis
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show current page and one before/after
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // If there are many pages, show ellipsis
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page is always shown (if there are more than 1 pages)
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow">
        <section className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Sports Venues</h1>
                <p className="text-muted-foreground mt-1">Find and book the perfect venue for your next game</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <Link to="/bookings">
                  <Button variant="outline">My Bookings</Button>
                </Link>
                <Link to="/venues/request">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    List Your Ground
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mb-8">
              <VenueFilter onFilterChange={handleFilterChange} />
            </div>
            
            <Separator className="mb-8" />
            
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load venues. Please try again later.
                </AlertDescription>
              </Alert>
            )}
            
            {!isLoading && !error && venues.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Showing sample venues</h3>
                <p className="text-muted-foreground mb-6">No real venues found with your current filters. Here are some sample venues:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                  {dummyVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              </div>
            )}
            
            {!isLoading && !error && venues.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination className="mt-10">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Venues;
