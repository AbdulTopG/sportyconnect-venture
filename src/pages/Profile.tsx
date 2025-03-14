
import React, { useState } from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Redirect, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { CalendarDays, MapPin, Activity, Trophy, Shield, User as UserIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Placeholder profile data
  const [profileData, setProfileData] = useState({
    username: 'SportyUser',
    fullName: 'John Doe',
    email: user?.email || '',
    phone: user?.phone || '',
    location: 'New York, NY',
    bio: 'Sports enthusiast, love to play basketball and soccer on weekends.',
    favoriteTeam: 'New York Knicks',
    avatar: '',
    primarySport: 'Basketball',
    skillLevel: 'Intermediate',
  });
  
  // Placeholder stats data
  const stats = {
    matches: 24,
    wins: 16,
    losses: 8,
    winRate: '66.7%',
    tournaments: 3,
    bestRank: 4,
    favoriteVenue: 'Central Park Courts',
    averageScore: 18.5,
  };
  
  // Placeholder match history
  const matchHistory = [
    { id: '1', date: '2023-06-20', sport: 'Basketball', opponent: 'Downtown Dribblers', result: 'Win', score: '82-76' },
    { id: '2', date: '2023-06-15', sport: 'Basketball', opponent: 'Riverside Rebels', result: 'Loss', score: '68-72' },
    { id: '3', date: '2023-06-10', sport: 'Soccer', opponent: 'Midtown FC', result: 'Win', score: '3-1' },
    { id: '4', date: '2023-06-05', sport: 'Tennis', opponent: 'Sarah Wilson', result: 'Win', score: '6-4, 7-5' },
    { id: '5', date: '2023-06-01', sport: 'Basketball', opponent: 'Heights Hustlers', result: 'Win', score: '90-85' },
  ];
  
  // Placeholder tournaments
  const tournaments = [
    { id: '1', name: 'Summer Basketball Cup', date: '2023-05-15', position: '2nd Place', teams: 16 },
    { id: '2', name: 'City Soccer League', date: '2023-04-10', position: '4th Place', teams: 12 },
    { id: '3', name: 'Spring Tennis Open', date: '2023-03-05', position: 'Quarter-finalist', teams: 32 },
  ];
  
  // Placeholder teams
  const teams = [
    { id: '1', name: 'NYC Ballers', sport: 'Basketball', members: 5, role: 'Captain' },
    { id: '2', name: 'Manhattan FC', sport: 'Soccer', members: 11, role: 'Member' },
  ];

  if (!user) {
    return (
      <Redirect to="/auth" />
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="md:flex md:space-x-8">
            {/* Profile Sidebar */}
            <aside className="md:w-1/4 mb-6 md:mb-0">
              <div className="sportyfi-card flex flex-col items-center p-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profileData.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold">{profileData.fullName}</h2>
                <p className="text-gray-500 mb-2">@{profileData.username}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profileData.location}</span>
                </div>
                
                <Badge className="mb-4 bg-blue-500">{profileData.primarySport} - {profileData.skillLevel}</Badge>
                
                <div className="w-full grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <p className="font-bold text-lg">{stats.matches}</p>
                    <p className="text-xs text-gray-500">Matches</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{stats.wins}</p>
                    <p className="text-xs text-gray-500">Wins</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{stats.tournaments}</p>
                    <p className="text-xs text-gray-500">Tourneys</p>
                  </div>
                </div>
                
                <Button
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => setActiveTab('settings')}
                >
                  Edit Profile
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 hover:text-red-700"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
              
              <div className="hidden md:block sportyfi-card mt-4 p-4">
                <h3 className="font-semibold mb-3">My Teams</h3>
                {teams.map(team => (
                  <div key={team.id} className="flex items-center justify-between mb-2 pb-2 border-b last:border-0 last:mb-0 last:pb-0">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-xs text-gray-500">{team.sport} • {team.role}</p>
                    </div>
                    <Badge variant="outline">{team.members}</Badge>
                  </div>
                ))}
              </div>
            </aside>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">Match History</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="sportyfi-card">
                    <h2 className="text-xl font-semibold mb-4">About Me</h2>
                    <p className="text-gray-700">{profileData.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">Full Name</p>
                          <p className="text-gray-600">{profileData.fullName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">Favorite Team</p>
                          <p className="text-gray-600">{profileData.favoriteTeam}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">Primary Sport</p>
                          <p className="text-gray-600">{profileData.primarySport}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">Skill Level</p>
                          <p className="text-gray-600">{profileData.skillLevel}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sportyfi-card">
                    <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Win Rate</p>
                        <p className="text-2xl font-bold text-green-600">{stats.winRate}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Matches</p>
                        <p className="text-2xl font-bold">{stats.matches}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Tournaments</p>
                        <p className="text-2xl font-bold">{stats.tournaments}</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Best Rank</p>
                        <p className="text-2xl font-bold">#{stats.bestRank}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Favorite Venue</span>
                        <span className="font-medium">{stats.favoriteVenue}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Average Score (Basketball)</span>
                        <span className="font-medium">{stats.averageScore} PPG</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sportyfi-card">
                    <h2 className="text-xl font-semibold mb-4">Recent Tournaments</h2>
                    {tournaments.length > 0 ? (
                      <div className="space-y-4">
                        {tournaments.map(tournament => (
                          <div key={tournament.id} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                            <div>
                              <p className="font-medium">{tournament.name}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                <span>{new Date(tournament.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-blue-500">{tournament.position}</Badge>
                              <p className="text-xs text-gray-500 mt-1">{tournament.teams} teams</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">You haven't participated in any tournaments yet.</p>
                    )}
                  </div>
                </TabsContent>
                
                {/* Match History Tab */}
                <TabsContent value="history">
                  <div className="sportyfi-card">
                    <h2 className="text-xl font-semibold mb-4">Match History</h2>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Sport</TableHead>
                          <TableHead>Opponent</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {matchHistory.map(match => (
                          <TableRow key={match.id}>
                            <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                            <TableCell>{match.sport}</TableCell>
                            <TableCell>{match.opponent}</TableCell>
                            <TableCell>
                              <span className={match.result === 'Win' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {match.result}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{match.score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <div className="sportyfi-card">
                    <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="favoriteTeam">Favorite Team</Label>
                          <Input
                            id="favoriteTeam"
                            name="favoriteTeam"
                            value={profileData.favoriteTeam}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Primary Sport</Label>
                          <Select 
                            value={profileData.primarySport}
                            onValueChange={(value) => handleSelectChange('primarySport', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your primary sport" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basketball">Basketball</SelectItem>
                              <SelectItem value="Soccer">Soccer</SelectItem>
                              <SelectItem value="Tennis">Tennis</SelectItem>
                              <SelectItem value="Volleyball">Volleyball</SelectItem>
                              <SelectItem value="Baseball">Baseball</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Skill Level</Label>
                          <Select 
                            value={profileData.skillLevel}
                            onValueChange={(value) => handleSelectChange('skillLevel', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your skill level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Professional">Professional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-sportyfi-orange hover:bg-red-600 text-white mt-2"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="sportyfi-card mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                    <p className="text-gray-700 mb-4">These actions are irreversible. Please proceed with caution.</p>
                    
                    <div className="space-y-4">
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Reset Stats
                      </Button>
                      
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
