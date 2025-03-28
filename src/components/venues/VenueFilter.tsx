import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';

const sportOptions = [
  'All Sports',
  'Cricket',
  'Football',
  'Basketball',
  'Tennis',
  'Badminton',
  'Table Tennis',
  'Volleyball',
  'Swimming',
  'Yoga'
];

const locationOptions = [
  'All Locations',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur'
];

export interface VenueFilterValues {
  searchQuery: string;
  sport: string;
  location: string;
  priceRange: [number, number];
}

interface VenueFilterProps {
  onFilterChange: (filters: VenueFilterValues) => void;
}

const VenueFilter = ({ onFilterChange }: VenueFilterProps) => {
  const [filters, setFilters] = useState<VenueFilterValues>({
    searchQuery: '',
    sport: 'All Sports',
    location: 'All Locations',
    priceRange: [0, 5000],
  });
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchQuery: e.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSportChange = (value: string) => {
    const newFilters = {
      ...filters,
      sport: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleLocationChange = (value: string) => {
    const newFilters = {
      ...filters,
      location: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handlePriceChange = (value: number[]) => {
    // Ensure we always have exactly two values for the tuple type
    const priceRange: [number, number] = [
      value[0] ?? 0,
      value[1] ?? 5000
    ];
    
    const newFilters = {
      ...filters,
      priceRange
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleReset = () => {
    const defaultFilters: VenueFilterValues = {
      searchQuery: '',
      sport: 'All Sports',
      location: 'All Locations',
      priceRange: [0, 5000],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };
  
  return (
    <div className="w-full">
      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search venues..."
              className="pl-10"
              value={filters.searchQuery}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="col-span-2">
            <Select value={filters.sport} onValueChange={handleSportChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                {sportOptions.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-2">
            <Select value={filters.location} onValueChange={handleLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-3">
            <div className="flex items-center">
              <Label className="mr-2 whitespace-nowrap">Price:</Label>
              <div className="flex-1 px-2">
                <Slider
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  min={0}
                  max={5000}
                  step={100}
                  onValueChange={handlePriceChange}
                />
              </div>
              <div className="text-sm whitespace-nowrap">
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Filters */}
      <div className="block md:hidden">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search venues..."
              className="pl-10"
              value={filters.searchQuery}
              onChange={handleInputChange}
            />
          </div>
          
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Venues</SheetTitle>
                <SheetDescription>
                  Adjust filters to find the perfect venue
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Sport</Label>
                  <Select value={filters.sport} onValueChange={handleSportChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportOptions.map(sport => (
                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={filters.location} onValueChange={handleLocationChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.priceRange[0], filters.priceRange[1]]}
                      min={0}
                      max={5000}
                      step={100}
                      onValueChange={handlePriceChange}
                      className="my-4"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={handleReset} variant="outline" className="w-full mt-2">
                    Reset Filters
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="w-full">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default VenueFilter;
