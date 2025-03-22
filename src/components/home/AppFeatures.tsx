
import { Card, CardContent } from '@/components/ui/card';

const AppFeatures = () => {
  return (
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
              <h3 className="text-xl font-bold mb-2">Watch Live Matches</h3>
              <p>Stream live sports events, watch past recordings, and interact with other fans through chat and reactions.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppFeatures;
