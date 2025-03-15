
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import LiveMatchCard from '@/components/watch/LiveMatchCard';
import UpcomingMatchCard from '@/components/watch/UpcomingMatchCard';
import RecordedMatchCard from '@/components/watch/RecordedMatchCard';
import LiveChat from '@/components/watch/LiveChat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PlayCircle, Clock, Archive, Search, BellRing, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Dummy data for matches
const liveMatches = [
  {
    id: 'live1',
    title: 'Cricket Premier League - Mumbai vs Delhi',
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    viewers: 1245,
    sport: 'Cricket',
    teams: { home: 'Mumbai Tigers', away: 'Delhi Capitals' },
    score: { home: 120, away: 110 },
    thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
  },
  {
    id: 'live2',
    title: 'Football League - Kolkata vs Chennai',
    streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    viewers: 823,
    sport: 'Football',
    teams: { home: 'Kolkata Warriors', away: 'Chennai United' },
    score: { home: 2, away: 1 },
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=735&auto=format&fit=crop',
    startTime: new Date(Date.now() - 45 * 60 * 1000), // Started 45 minutes ago
  },
];

const upcomingMatches = [
  {
    id: 'upcoming1',
    title: 'Basketball Championship - Bangalore vs Hyderabad',
    sport: 'Basketball',
    teams: { home: 'Bangalore Bulls', away: 'Hyderabad Hawks' },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Starts in 2 hours
    remindersEnabled: false,
  },
  {
    id: 'upcoming2',
    title: 'Tennis Finals - Rajasthan vs Punjab',
    sport: 'Tennis',
    teams: { home: 'Rajasthan Royals', away: 'Punjab Kings' },
    thumbnail: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // Starts in 4 hours
    remindersEnabled: true,
  },
  {
    id: 'upcoming3',
    title: 'Volleyball Tournament - Gujarat vs Kerala',
    sport: 'Volleyball',
    teams: { home: 'Gujarat Giants', away: 'Kerala Spikers' },
    thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // Starts in 6 hours
    remindersEnabled: false,
  },
];

const recordedMatches = [
  {
    id: 'recorded1',
    title: 'Cricket Premier League - Mumbai vs Chennai (Highlights)',
    sport: 'Cricket',
    teams: { home: 'Mumbai Tigers', away: 'Chennai Super Kings' },
    thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
    recordedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: '12:34',
    views: 4523,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'recorded2',
    title: 'Football League Finals - Delhi vs Kolkata (Full Match)',
    sport: 'Football',
    teams: { home: 'Delhi Dynamos', away: 'Kolkata Warriors' },
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=735&auto=format&fit=crop',
    recordedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    duration: '1:45:22',
    views: 7891,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'recorded3',
    title: 'Basketball Championship - Hyderabad vs Bangalore (Highlights)',
    sport: 'Basketball',
    teams: { home: 'Hyderabad Hawks', away: 'Bangalore Bulls' },
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop',
    recordedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    duration: '9:45',
    views: 3254,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

const WatchMatches = () => {
  const [selectedMatch, setSelectedMatch] = useState<typeof liveMatches[0] | null>(null);
  const [activeTab, setActiveTab] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Set first live match as default selected match
  useEffect(() => {
    if (liveMatches.length > 0 && !selectedMatch) {
      setSelectedMatch(liveMatches[0]);
    }
  }, [selectedMatch]);

  const handleWatchMatch = (match: typeof liveMatches[0]) => {
    setSelectedMatch(match);
    setActiveTab('live');
  };
  
  const handleToggleReminder = (matchId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to set match reminders",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would update a database
    toast({
      title: "Reminder Set",
      description: "You'll be notified when this match starts",
    });
  };

  const handleSendMessage = (message: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to participate in live chat",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send message to a database/socket
    console.log("Message sent:", message);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow">
        <div className="sportyfi-container py-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <PlayCircle className="mr-2 text-red-500" size={32} /> Watch Matches
          </h1>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content */}
            <div className="w-full lg:w-2/3">
              {selectedMatch ? (
                <div className="mb-6">
                  <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-black">
                    <iframe 
                      src={selectedMatch.streamUrl} 
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedMatch.title}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <h2 className="text-xl font-bold">{selectedMatch.title}</h2>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                        LIVE
                      </span>
                      <span className="mx-2">•</span>
                      <span>{selectedMatch.viewers.toLocaleString()} viewers</span>
                      <span className="mx-2">•</span>
                      <span>{selectedMatch.sport}</span>
                    </div>
                    
                    <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold">{selectedMatch.teams.home}</div>
                        <div className="text-lg font-bold">{selectedMatch.score.home} - {selectedMatch.score.away}</div>
                        <div className="font-semibold">{selectedMatch.teams.away}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-12 bg-gray-100 rounded-lg text-center">
                  <p className="text-gray-500">Select a match to watch</p>
                </div>
              )}
              
              <div className="mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="live" className="flex items-center">
                        <PlayCircle className="mr-1 h-4 w-4" /> Live
                      </TabsTrigger>
                      <TabsTrigger value="upcoming" className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" /> Upcoming
                      </TabsTrigger>
                      <TabsTrigger value="recorded" className="flex items-center">
                        <Archive className="mr-1 h-4 w-4" /> Recorded
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input 
                        placeholder="Search matches..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>
                  </div>
                  
                  <TabsContent value="live">
                    {liveMatches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {liveMatches.map(match => (
                          <LiveMatchCard 
                            key={match.id} 
                            match={match} 
                            onWatch={() => handleWatchMatch(match)}
                            isSelected={selectedMatch?.id === match.id}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500">No live matches at the moment</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="upcoming">
                    {upcomingMatches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingMatches.map(match => (
                          <UpcomingMatchCard 
                            key={match.id} 
                            match={match} 
                            onToggleReminder={() => handleToggleReminder(match.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500">No upcoming matches scheduled</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="recorded">
                    {recordedMatches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recordedMatches.map(match => (
                          <RecordedMatchCard 
                            key={match.id} 
                            match={match}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500">No recorded matches available</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <LiveChat onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WatchMatches;
