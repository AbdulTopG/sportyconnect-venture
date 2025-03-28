
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Map, Calendar, Search } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleFindMatches = () => {
    navigate('/matches');
  };
  
  const handleHostMatch = () => {
    navigate('/matches/create');
  };
  
  const handleGroundsBooking = () => {
    navigate('/venues');
  };
  
  const handleWatchMatches = () => {
    navigate('/watch');
  };
  
  return (
    <section className="relative bg-gradient-to-r from-sportyfi-black to-sportyfi-darkGray text-white py-20 md:py-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-sportyfi-orange blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-red-600 blur-3xl"></div>
      </div>
      
      <div className="sportyfi-container relative z-10">
        <div className="grid grid-cols-1 gap-10 items-center">
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <div className="inline-block bg-sportyfi-orange/20 rounded-full px-4 py-1 text-sportyfi-orange font-medium text-sm mb-2">
              #1 Sports Networking Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Connect. Play. <span className="text-sportyfi-orange">Win.</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              The ultimate platform to find local sports matches, showcase your skills, and compete in official tournaments.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button className="bg-sportyfi-orange hover:bg-red-600 text-white font-semibold h-14 text-lg w-full flex gap-2 justify-center" onClick={handleFindMatches}>
                <Search size={20} />
                Find Matches
              </Button>
              
              <Button variant="outline" onClick={handleHostMatch} className="border-white text-white hover:bg-white/10 font-semibold h-14 text-lg w-full flex gap-2 justify-center">
                <Calendar size={20} />
                Host a Match
              </Button>
              
              <Button variant="outline" onClick={handleWatchMatches} className="border-white text-white hover:bg-white/10 font-semibold h-14 text-lg w-full flex items-center gap-2 justify-center">
                <PlayCircle size={20} />
                Watch Matches
                <span className="ml-1 bg-red-500 text-xs px-1.5 py-0.5 rounded-full animate-pulse text-indigo-50">Live</span>
              </Button>
              
              <Button variant="outline" onClick={handleGroundsBooking} className="border-white text-white hover:bg-white/10 font-semibold h-14 text-lg w-full flex items-center gap-2 justify-center">
                <Map size={20} />
                Grounds Booking
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-3 pt-4 text-sm text-gray-300">
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                5,000+ Active Users
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-500"></span>
              <span>2,500+ Matches Hosted</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-500"></span>
              <span>15+ Sports</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
