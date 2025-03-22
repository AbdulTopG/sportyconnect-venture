
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Sport } from '@/data/sportsData';

interface SportCardProps {
  sport: Sport;
  onClick: (sport: string) => void;
}

const SportCard = ({ sport, onClick }: SportCardProps) => {
  return (
    <Card 
      key={sport.name} 
      className="sportyfi-card overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow" 
      onClick={() => onClick(sport.name)}
    >
      <CardContent className="p-0">
        <div className="aspect-square bg-muted relative">
          <AspectRatio ratio={1} className="w-full h-full">
            <img src={sport.image} alt={sport.alt || `${sport.name} player in action`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{sport.name}</span>
            </div>
          </AspectRatio>
          <div className="absolute bottom-0 left-0 right-0 bg-sportyfi-orange text-white text-center py-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
            View Matches
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SportCard;
