
import type { VenueWithRelations } from '@/integrations/supabase/client';

// Sample dummy venues for when no real venues are found
export const dummyVenues: VenueWithRelations[] = [
  {
    id: 'dummy-1',
    name: 'Mumbai Football Arena',
    description: 'A state-of-the-art football facility with premium grass turf and floodlights.',
    location: 'Mumbai',
    price_per_hour: 1500,
    is_verified: true,
    contact_phone: '+91 9876543210',
    contact_email: 'info@mumbaifootball.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: null,
    latitude: 19.0760,
    longitude: 72.8777,
    sports: [
      { id: 'd1', venue_id: 'dummy-1', sport: 'Football', created_at: new Date().toISOString() },
      { id: 'd2', venue_id: 'dummy-1', sport: 'Rugby', created_at: new Date().toISOString() }
    ],
    amenities: [
      { id: 'a1', venue_id: 'dummy-1', amenity: 'Floodlights', created_at: new Date().toISOString() },
      { id: 'a2', venue_id: 'dummy-1', amenity: 'Changing Rooms', created_at: new Date().toISOString() },
      { id: 'a3', venue_id: 'dummy-1', amenity: 'Parking', created_at: new Date().toISOString() }
    ],
    images: [
      { id: 'i1', venue_id: 'dummy-1', image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=735&auto=format&fit=crop', is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'dummy-2',
    name: 'DY Patil Stadium',
    description: 'World-class cricket stadium that also hosts football matches and concerts.',
    location: 'Navi Mumbai',
    price_per_hour: 2500,
    is_verified: true,
    contact_phone: '+91 9876543211',
    contact_email: 'bookings@dypatil.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: null,
    latitude: 19.0437,
    longitude: 73.0292,
    sports: [
      { id: 'd3', venue_id: 'dummy-2', sport: 'Cricket', created_at: new Date().toISOString() },
      { id: 'd4', venue_id: 'dummy-2', sport: 'Football', created_at: new Date().toISOString() }
    ],
    amenities: [
      { id: 'a4', venue_id: 'dummy-2', amenity: 'Floodlights', created_at: new Date().toISOString() },
      { id: 'a5', venue_id: 'dummy-2', amenity: 'VIP Boxes', created_at: new Date().toISOString() },
      { id: 'a6', venue_id: 'dummy-2', amenity: 'Food Court', created_at: new Date().toISOString() }
    ],
    images: [
      { id: 'i2', venue_id: 'dummy-2', image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop', is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'dummy-3',
    name: 'Cooperage Ground',
    description: 'Historic football ground in the heart of Mumbai with natural grass.',
    location: 'Mumbai',
    price_per_hour: 1200,
    is_verified: true,
    contact_phone: '+91 9876543212',
    contact_email: 'cooperage@wifa.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: null,
    latitude: 18.9294,
    longitude: 72.8271,
    sports: [
      { id: 'd5', venue_id: 'dummy-3', sport: 'Football', created_at: new Date().toISOString() }
    ],
    amenities: [
      { id: 'a7', venue_id: 'dummy-3', amenity: 'Stadium Seating', created_at: new Date().toISOString() },
      { id: 'a8', venue_id: 'dummy-3', amenity: 'Changing Rooms', created_at: new Date().toISOString() }
    ],
    images: [
      { id: 'i3', venue_id: 'dummy-3', image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop', is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'dummy-4',
    name: 'Shree Shiv Chhatrapati Sports Complex',
    description: 'Multipurpose sports complex with facilities for various sports.',
    location: 'Pune',
    price_per_hour: 1800,
    is_verified: true,
    contact_phone: '+91 9876543213',
    contact_email: 'bookings@balewadi.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: null,
    latitude: 18.5793,
    longitude: 73.7746,
    sports: [
      { id: 'd6', venue_id: 'dummy-4', sport: 'Football', created_at: new Date().toISOString() },
      { id: 'd7', venue_id: 'dummy-4', sport: 'Tennis', created_at: new Date().toISOString() },
      { id: 'd8', venue_id: 'dummy-4', sport: 'Swimming', created_at: new Date().toISOString() }
    ],
    amenities: [
      { id: 'a9', venue_id: 'dummy-4', amenity: 'Olympic Pool', created_at: new Date().toISOString() },
      { id: 'a10', venue_id: 'dummy-4', amenity: 'Tennis Courts', created_at: new Date().toISOString() },
      { id: 'a11', venue_id: 'dummy-4', amenity: 'Gym', created_at: new Date().toISOString() }
    ],
    images: [
      { id: 'i4', venue_id: 'dummy-4', image_url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop', is_primary: true, created_at: new Date().toISOString() }
    ]
  }
];
