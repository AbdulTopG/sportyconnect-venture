
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, MapPin, Share2, Shield, Trophy, Smartphone, CreditCard } from 'lucide-react';

const AppFeatures = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="sportyfi-container">
        <h2 className="text-3xl font-bold mb-2 text-center">Why Choose SportyFi?</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Discover all the benefits and features that make SportyFi the ultimate sports networking platform.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <Calendar className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Host & Join Matches</h3>
              <p className="text-muted-foreground">Create your own sports matches or join others in your area. Set the sport, venue, time, and skill level.</p>
            </CardContent>
          </Card>
          
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <Trophy className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Performance</h3>
              <p className="text-muted-foreground">Monitor your stats, win/loss record, and climb the leaderboards in your favorite sports.</p>
            </CardContent>
          </Card>
          
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <Smartphone className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Watch Live Matches</h3>
              <p className="text-muted-foreground">Stream live sports events, watch past recordings, and interact with other fans through chat and reactions.</p>
            </CardContent>
          </Card>
          
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <MapPin className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Venue Booking</h3>
              <p className="text-muted-foreground">Find and book sports venues in your area. Filter by sport, location, amenities, and availability.</p>
            </CardContent>
          </Card>
          
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <Share2 className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Social Sharing</h3>
              <p className="text-muted-foreground">Share your achievements, upcoming matches, and tournament results with friends on social media.</p>
            </CardContent>
          </Card>
          
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <Shield className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Players</h3>
              <p className="text-muted-foreground">Connect with verified players to ensure fair play and quality matches in a trusted environment.</p>
            </CardContent>
          </Card>
          
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <Clock className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">Get notifications about match changes, venue availability, and tournament announcements.</p>
            </CardContent>
          </Card>
          
          <Card className="sportyfi-card hover:border-sportyfi-orange transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sportyfi-orange/10 mb-4">
                <CreditCard className="h-7 w-7 text-sportyfi-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">Pay for venue bookings, tournament entries, and premium features with our secure payment system.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppFeatures;
