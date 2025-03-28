import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Calendar, Clock } from 'lucide-react';
const CTASection = () => {
  return <section className="py-16 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-sportyfi-black to-sportyfi-darkGray z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-sportyfi-orange/80 to-red-600/80 z-10 opacity-90 bg-sportyfi-orange"></div>
      
      <div className="sportyfi-container relative z-20 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-lg md:text-xl mb-8">
            Join SportyFi today and connect with athletes in your area. Host matches, join tournaments, and showcase your skills!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 mb-3">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">5,000+</div>
              <div className="text-sm opacity-80">Active Players</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 mb-3">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">2,500+</div>
              <div className="text-sm opacity-80">Matches Hosted</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 mb-3">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">4.8/5</div>
              <div className="text-sm opacity-80">User Rating</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-xl font-bold">15+</div>
              <div className="text-sm opacity-80">Sports Available</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth?tab=signup">
              <Button className="font-semibold px-8 py-6 h-auto text-lg w-full sm:w-auto bg-sportyfi-orange text-sportyfi-lightGray">
                Create Your Account
              </Button>
            </Link>
            <Link to="/matches">
              <Button variant="outline" className="border-white text-white font-semibold px-8 py-6 h-auto text-lg w-full sm:w-auto bg-sportyfi-orange">
                Browse Matches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default CTASection;