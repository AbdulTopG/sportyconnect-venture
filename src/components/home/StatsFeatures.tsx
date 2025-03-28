
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Activity, Users, TrendingUp } from 'lucide-react';

const StatsFeatures = () => {
  return (
    <section className="py-16 bg-white">
      <div className="sportyfi-container">
        <h2 className="text-3xl font-bold mb-2 text-center">Track Your Performance</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Monitor your stats, win/loss record, and climb the leaderboards in your favorite sports.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-md border-t-4 border-t-sportyfi-orange">
            <CardContent className="pt-6">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-sportyfi-orange/10 rounded-lg mr-4">
                  <Trophy className="h-6 w-6 text-sportyfi-orange" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Achievements</h3>
                  <p className="text-sm text-muted-foreground">Unlock badges & earn points</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Consistency Badge</span>
                    <span className="font-medium">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>MVP Badge</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-green-500">
            <CardContent className="pt-6">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg mr-4">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Performance</h3>
                  <p className="text-sm text-muted-foreground">Track your game stats</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Win Rate</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Skill Rating</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Network</h3>
                  <p className="text-sm text-muted-foreground">Connect with other players</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Connections</span>
                    <span className="font-medium">124</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Teams Joined</span>
                    <span className="font-medium">3</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Leaderboards</h3>
                  <p className="text-sm text-muted-foreground">Your ranking across sports</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>City Ranking</span>
                    <span className="font-medium">#28</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>National Ranking</span>
                    <span className="font-medium">#342</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StatsFeatures;
