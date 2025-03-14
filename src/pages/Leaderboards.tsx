
import React, { useState } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Award, Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Leaderboards = () => {
  const [sportFilter, setSportFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  // Placeholder leaderboard data
  const players = [
    { id: '1', rank: 1, name: 'Michael Jordan', avatar: '', wins: 28, losses: 2, sport: 'Basketball', rating: 1950, tier: 'Diamond', winStreak: 8 },
    { id: '2', rank: 2, name: 'LeBron James', avatar: '', wins: 25, losses: 5, sport: 'Basketball', rating: 1920, tier: 'Diamond', winStreak: 3 },
    { id: '3', rank: 3, name: 'Stephen Curry', avatar: '', wins: 24, losses: 6, sport: 'Basketball', rating: 1890, tier: 'Diamond', winStreak: 0 },
    { id: '4', rank: 4, name: 'Roger Federer', avatar: '', wins: 30, losses: 8, sport: 'Tennis', rating: 1880, tier: 'Diamond', winStreak: 5 },
    { id: '5', rank: 5, name: 'Serena Williams', avatar: '', wins: 28, losses: 10, sport: 'Tennis', rating: 1870, tier: 'Diamond', winStreak: 2 },
    { id: '6', rank: 6, name: 'Cristiano Ronaldo', avatar: '', wins: 22, losses: 8, sport: 'Soccer', rating: 1850, tier: 'Platinum', winStreak: 4 },
    { id: '7', rank: 7, name: 'Lionel Messi', avatar: '', wins: 20, losses: 10, sport: 'Soccer', rating: 1840, tier: 'Platinum', winStreak: 2 },
    { id: '8', rank: 8, name: 'Kevin Durant', avatar: '', wins: 18, losses: 12, sport: 'Basketball', rating: 1820, tier: 'Platinum', winStreak: 0 },
    { id: '9', rank: 9, name: 'Rafael Nadal', avatar: '', wins: 25, losses: 15, sport: 'Tennis', rating: 1810, tier: 'Platinum', winStreak: 3 },
    { id: '10', rank: 10, name: 'Neymar Jr', avatar: '', wins: 17, losses: 13, sport: 'Soccer', rating: 1800, tier: 'Platinum', winStreak: 1 },
  ];
  
  const teams = [
    { id: '1', rank: 1, name: 'Golden State Warriors', avatar: '', wins: 30, losses: 5, sport: 'Basketball', rating: 1980, tier: 'Diamond' },
    { id: '2', rank: 2, name: 'Los Angeles Lakers', avatar: '', wins: 28, losses: 7, sport: 'Basketball', rating: 1950, tier: 'Diamond' },
    { id: '3', rank: 3, name: 'FC Barcelona', avatar: '', wins: 25, losses: 5, sport: 'Soccer', rating: 1940, tier: 'Diamond' },
    { id: '4', rank: 4, name: 'Real Madrid', avatar: '', wins: 24, losses: 6, sport: 'Soccer', rating: 1930, tier: 'Diamond' },
    { id: '5', rank: 5, name: 'Team Federer', avatar: '', wins: 22, losses: 8, sport: 'Tennis', rating: 1900, tier: 'Diamond' },
    { id: '6', rank: 6, name: 'Boston Celtics', avatar: '', wins: 20, losses: 10, sport: 'Basketball', rating: 1880, tier: 'Platinum' },
    { id: '7', rank: 7, name: 'Manchester City', avatar: '', wins: 19, losses: 11, sport: 'Soccer', rating: 1860, tier: 'Platinum' },
    { id: '8', rank: 8, name: 'Team Williams', avatar: '', wins: 18, losses: 12, sport: 'Tennis', rating: 1840, tier: 'Platinum' },
    { id: '9', rank: 9, name: 'Miami Heat', avatar: '', wins: 17, losses: 13, sport: 'Basketball', rating: 1820, tier: 'Platinum' },
    { id: '10', rank: 10, name: 'Liverpool FC', avatar: '', wins: 16, losses: 14, sport: 'Soccer', rating: 1800, tier: 'Platinum' },
  ];
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond':
        return 'bg-blue-500';
      case 'Platinum':
        return 'bg-purple-500';
      case 'Gold':
        return 'bg-yellow-500';
      case 'Silver':
        return 'bg-gray-400';
      case 'Bronze':
        return 'bg-amber-600';
      default:
        return 'bg-gray-500';
    }
  };
  
  const filterPlayers = () => {
    let filtered = players;
    
    if (sportFilter !== 'all') {
      filtered = filtered.filter(player => player.sport.toLowerCase() === sportFilter.toLowerCase());
    }
    
    if (searchQuery) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  const filterTeams = () => {
    let filtered = teams;
    
    if (sportFilter !== 'all') {
      filtered = filtered.filter(team => team.sport.toLowerCase() === sportFilter.toLowerCase());
    }
    
    if (searchQuery) {
      filtered = filtered.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Get all unique sports for filtering
  const allSports = [...new Set([...players.map(p => p.sport.toLowerCase()), ...teams.map(t => t.sport.toLowerCase())])];

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-sportyfi-orange" />
              <h1 className="text-2xl md:text-3xl font-bold">Leaderboards</h1>
            </div>
            
            <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} gap-2`}>
              <div className={`${isMobile ? 'w-full' : 'w-40'}`}>
                <Select 
                  value={sportFilter} 
                  onValueChange={setSportFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    {allSports.map(sport => (
                      <SelectItem key={sport} value={sport}>
                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className={`relative ${isMobile ? 'w-full' : 'w-60'}`}>
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search players or teams"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="players" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="players">Individual Players</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            
            <TabsContent value="players" className="sportyfi-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">Sport</TableHead>
                    <TableHead className="text-center">Tier</TableHead>
                    <TableHead className="text-center">W/L</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>Rating</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>Win Streak</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterPlayers().map((player) => (
                    <TableRow key={player.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {player.rank <= 3 ? (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                            ${player.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                              player.rank === 2 ? 'bg-gray-200 text-gray-800' : 
                              'bg-amber-100 text-amber-800'}`}>
                            {player.rank}
                          </span>
                        ) : player.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{player.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{player.sport}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getTierColor(player.tier)}>
                          {player.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{player.wins}-{player.losses}</TableCell>
                      <TableCell className="text-center font-medium">{player.rating}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-medium ${player.winStreak > 0 ? 'text-green-600' : ''}`}>
                          {player.winStreak}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="teams" className="sportyfi-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-center">Sport</TableHead>
                    <TableHead className="text-center">Tier</TableHead>
                    <TableHead className="text-center">W/L</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>Rating</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterTeams().map((team) => (
                    <TableRow key={team.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {team.rank <= 3 ? (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                            ${team.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                              team.rank === 2 ? 'bg-gray-200 text-gray-800' : 
                              'bg-amber-100 text-amber-800'}`}>
                            {team.rank}
                          </span>
                        ) : team.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={team.avatar} />
                            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{team.sport}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getTierColor(team.tier)}>
                          {team.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{team.wins}-{team.losses}</TableCell>
                      <TableCell className="text-center font-medium">{team.rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboards;
