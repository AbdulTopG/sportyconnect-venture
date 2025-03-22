
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';

const SportCategories = () => {
  const navigate = useNavigate();
  
  const handleSportCardClick = (sport: string) => {
    navigate(`/matches?sport=${sport.toLowerCase()}`);
  };

  const sports = [
    'Football', 
    'Cricket', 
    'Basketball', 
    'Tennis', 
    'Kabaddi', 
    'Volleyball', 
    'Snooker', 
    'Table Tennis'
  ];

  const getSportImage = (sport: string) => {
    switch(sport) {
      case 'Football': 
        return "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=735&auto=format&fit=crop";
      case 'Cricket': 
        return "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop";
      case 'Basketball': 
        return "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop";
      case 'Tennis': 
        return "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop";
      case 'Kabaddi': 
        return "/lovable-uploads/18cc269f-5358-4b3b-ab9c-a207d85ebb82.png";
      case 'Volleyball': 
        return "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop";
      case 'Snooker': 
        return "/lovable-uploads/814c89ff-45e2-42f6-a6ec-1823e126c5a1.png";
      case 'Table Tennis': 
        return "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1000&auto=format&fit=crop";
      default: 
        return "";
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="sportyfi-container">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Sports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sports.map(sport => (
            <Card 
              key={sport} 
              className="sportyfi-card overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleSportCardClick(sport)}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-muted relative">
                  <AspectRatio ratio={1} className="w-full h-full">
                    <img src={getSportImage(sport)} alt={`${sport} player in action`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{sport}</span>
                    </div>
                  </AspectRatio>
                  <div className="absolute bottom-0 left-0 right-0 bg-sportyfi-orange text-white text-center py-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    View Matches
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportCategories;
