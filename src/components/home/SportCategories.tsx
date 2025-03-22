
import { useNavigate } from 'react-router-dom';
import { sports } from '@/data/sportsData';
import SportCard from '@/components/home/SportCard';

const SportCategories = () => {
  const navigate = useNavigate();
  
  const handleSportCardClick = (sport: string) => {
    navigate(`/matches?sport=${sport.toLowerCase()}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="sportyfi-container">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Sports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sports.map(sport => (
            <SportCard 
              key={sport.name}
              sport={sport} 
              onClick={handleSportCardClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportCategories;
