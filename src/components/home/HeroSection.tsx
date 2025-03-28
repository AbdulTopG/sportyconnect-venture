
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-sportyfi-orange/20 rounded-full px-4 py-1 text-sportyfi-orange font-medium text-sm mb-2">
              #1 Sports Networking Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Connect. Play. <span className="text-sportyfi-orange">Win.</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg">
              The ultimate platform to find local sports matches, showcase your skills, and compete in official tournaments.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                className="bg-sportyfi-orange hover:bg-red-600 text-white font-semibold h-14 text-lg w-full flex gap-2"
                onClick={handleFindMatches}
              >
                <Search size={20} />
                Find Matches
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleHostMatch} 
                className="border-white text-white hover:bg-white/10 font-semibold h-14 text-lg w-full flex gap-2"
              >
                <Calendar size={20} />
                Host a Match
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleWatchMatches} 
                className="border-white text-white hover:bg-white/10 font-semibold h-14 text-lg w-full flex items-center gap-2"
              >
                <PlayCircle size={20} />
                Watch Matches
                <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">Live</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGroundsBooking} 
                className="border-white text-white hover:bg-white/10 font-semibold h-14 text-lg w-full flex items-center gap-2"
              >
                <Map size={20} />
                Grounds Booking
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 pt-4 text-sm text-gray-300">
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                5,000+ Active Users
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>2,500+ Matches Hosted</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>15+ Sports</span>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-2xl transform rotate-1">
              <img 
                src="https://images.unsplash.com/photo-1595435124324-81edc014bba9?q=80&w=1160" 
                alt="Sports" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-sm rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">Football Finals</div>
                    <div className="text-gray-400">Today, 7:30 PM</div>
                  </div>
                  <Button size="sm" className="bg-sportyfi-orange hover:bg-red-600">
                    Join Match
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-40 h-40 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=735" 
                alt="Sports" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
