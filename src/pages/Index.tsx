
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SportyFiHeader from '@/components/SportyFiHeader';
import UpcomingMatches from '@/components/UpcomingMatches';
import FeaturedTournaments from '@/components/FeaturedTournaments';
import Footer from '@/components/Footer';
import { Volleyball, Table, Dice6 } from 'lucide-react';

const Index = () => {
  const [location, setLocation] = useState('Mumbai');
  return <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-sportyfi-black to-sportyfi-darkGray text-white py-16 md:py-24">
          <div className="sportyfi-container relative z-10">
            <div className="max-w-2xl mx-auto text-center md:text-left md:mx-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Connect. Play. <span className="text-sportyfi-orange">Win.</span>
              </h1>
              <p className="text-lg md:text-xl mb-8">
                The ultimate platform to find local sports matches, showcase your skills, and compete in official tournaments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="bg-sportyfi-orange hover:bg-red-600 text-white font-semibold px-6 py-6 h-auto text-lg">
                  Find Matches
                </Button>
                <Button variant="outline" className="border-white text-white font-semibold px-6 py-6 h-auto text-lg bg-red-600 hover:bg-red-500">
                  Host a Match
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </section>

        {/* Sports Categories */}
        <section className="py-16 bg-white">
          <div className="sportyfi-container">
            <h2 className="text-3xl font-bold mb-8 text-center">Popular Sports</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Football', 'Cricket', 'Basketball', 'Tennis', 'Kabaddi', 'Volleyball', 'Snooker', 'Table Tennis'].map(sport => <Card key={sport} className="sportyfi-card overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted relative">
                      <AspectRatio ratio={1} className="w-full h-full">
                        {sport === 'Football' && <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=735&auto=format&fit=crop" alt="Football player in action" className="w-full h-full object-cover" />}
                        {sport === 'Cricket' && <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop" alt="Cricket player in action" className="w-full h-full object-cover" />}
                        {sport === 'Basketball' && <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop" alt="Basketball player in action" className="w-full h-full object-cover" />}
                        {sport === 'Tennis' && <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop" alt="Tennis player in action" className="w-full h-full object-cover" />}
                        {sport === 'Kabaddi' && <img src="https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?q=80&w=1000&auto=format&fit=crop" alt="Kabaddi players in action" className="w-full h-full object-cover" />}
                        {sport === 'Volleyball' && <img src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop" alt="Volleyball players in action" className="w-full h-full object-cover" />}
                        {sport === 'Snooker' && <img src="https://images.unsplash.com/photo-1615406030309-b7f985c85039?q=80&w=1000&auto=format&fit=crop" alt="Close up of snooker balls and cue on green table" className="w-full h-full object-cover" />}
                        {sport === 'Table Tennis' && <img src="https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1000&auto=format&fit=crop" alt="Table tennis paddle and ball" className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">{sport}</span>
                        </div>
                      </AspectRatio>
                      <div className="absolute bottom-0 left-0 right-0 bg-sportyfi-orange text-white text-center py-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        View Matches
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>
        
        {/* Upcoming Matches */}
        <section className="py-16 bg-gray-50">
          <div className="sportyfi-container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Matches Near You</h2>
              <div className="flex items-center mt-4 md:mt-0">
                <span className="mr-2">Location:</span>
                <select value={location} onChange={e => setLocation(e.target.value)} className="border rounded-md px-3 py-1">
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>
            <UpcomingMatches location={location} />
            <div className="text-center mt-8">
              <Link to="/matches">
                <Button variant="outline" className="border-sportyfi-orange text-sportyfi-orange hover:bg-sportyfi-orange hover:text-white">
                  See All Matches
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Tournaments */}
        <section className="py-16 bg-sportyfi-black text-white">
          <div className="sportyfi-container">
            <h2 className="text-3xl font-bold mb-8">Official SportyFi Tournaments</h2>
            <FeaturedTournaments />
            <div className="text-center mt-8">
              <Link to="/tournaments">
                <Button className="bg-sportyfi-orange hover:bg-red-600 text-white">
                  Explore All Tournaments
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats & Features */}
        <section className="py-16 bg-white">
          <div className="sportyfi-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-sportyfi-orange mb-2">5,000+</div>
                <div className="text-xl font-semibold">Active Players</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-sportyfi-orange mb-2">1,200+</div>
                <div className="text-xl font-semibold">Matches Every Month</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-sportyfi-orange mb-2">50+</div>
                <div className="text-xl font-semibold">Official Tournaments</div>
              </div>
            </div>
          </div>
        </section>

        {/* App Features */}
        <section className="py-16 bg-gray-50">
          <div className="sportyfi-container">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose SportyFi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="sportyfi-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Host & Join Matches</h3>
                  <p>Create your own sports matches or join others in your area. Set the sport, venue, time, and skill level.</p>
                </CardContent>
              </Card>
              <Card className="sportyfi-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Track Performance</h3>
                  <p>Monitor your stats, win/loss record, and climb the leaderboards in your favorite sports.</p>
                </CardContent>
              </Card>
              <Card className="sportyfi-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Official Tournaments</h3>
                  <p>Register for exclusive tournaments hosted by the SportyFi team with prizes and sponsorships.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-sportyfi-orange text-white">
          <div className="sportyfi-container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join SportyFi today and connect with athletes in your area. Host matches, join tournaments, and showcase your skills!
            </p>
            <Link to="/signup">
              <Button className="bg-white text-sportyfi-orange hover:bg-gray-100 font-semibold px-6 py-6 h-auto text-lg">
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;
