
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PlayCircle, Clock, Archive, Search } from 'lucide-react';
import LiveMatchesList from './LiveMatchesList';
import UpcomingMatchesList from './UpcomingMatchesList';
import RecordedMatchesList from './RecordedMatchesList';

interface MatchTabsProps {
  liveMatches: any[];
  upcomingMatches: any[];
  recordedMatches: any[];
  onWatchMatch: (match: any) => void;
  onToggleReminder: (matchId: string) => void;
  selectedMatchId?: string;
}

const MatchTabs: React.FC<MatchTabsProps> = ({
  liveMatches,
  upcomingMatches,
  recordedMatches,
  onWatchMatch,
  onToggleReminder,
  selectedMatchId
}) => {
  const [activeTab, setActiveTab] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');

  const filterMatches = (matches: any[]) => {
    if (!searchQuery.trim()) return matches;
    
    const query = searchQuery.toLowerCase();
    return matches.filter(
      match => match.title.toLowerCase().includes(query) || 
               match.sport.toLowerCase().includes(query) ||
               match.teams.home.toLowerCase().includes(query) ||
               match.teams.away.toLowerCase().includes(query)
    );
  };

  return (
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
          <LiveMatchesList 
            matches={filterMatches(liveMatches)} 
            onWatchMatch={onWatchMatch} 
            selectedMatchId={selectedMatchId} 
          />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <UpcomingMatchesList 
            matches={filterMatches(upcomingMatches)} 
            onToggleReminder={onToggleReminder} 
          />
        </TabsContent>
        
        <TabsContent value="recorded">
          <RecordedMatchesList 
            matches={filterMatches(recordedMatches)} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchTabs;
