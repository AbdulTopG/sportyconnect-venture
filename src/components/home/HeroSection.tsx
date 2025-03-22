
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Map } from 'lucide-react';

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
            <Button className="bg-sportyfi-orange hover:bg-red-600 text-white font-semibold px-6 py-6 h-auto text-lg" onClick={handleFindMatches}>
              Find Matches
            </Button>
            <Button variant="outline" onClick={handleWatchMatches} className="border-white text-white font-semibold px-6 py-6 h-auto text-lg flex items-center gap-2 bg-red-500 hover:bg-red-600">
              <PlayCircle size={20} />
              Watch Matches
              <span className="bg-white text-red-500 text-xs px-1.5 py-0.5 rounded-full">Live</span>
            </Button>
            <Button variant="outline" onClick={handleHostMatch} className="border-white text-white font-semibold px-6 py-6 h-auto text-lg bg-sportyfi-orange">
              Host a Match
            </Button>
            <Button variant="outline" onClick={handleGroundsBooking} className="border-white font-semibold px-6 py-6 h-auto text-lg flex items-center gap-2 text-stone-50 bg-sportyfi-orange">
              <Map size={20} />
              Grounds Booking
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/40 z-0"></div>
    </section>
  );
};

export default HeroSection;
