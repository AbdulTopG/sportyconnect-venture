
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FeaturedTournaments from '@/components/FeaturedTournaments';

const TournamentsSection = () => {
  return (
    <section className="py-16 bg-sportyfi-black text-white">
      <div className="sportyfi-container">
        <h2 className="text-3xl font-bold mb-8">Official SportyFi Tournaments</h2>
        <FeaturedTournaments />
        <div className="text-center mt-8">
          <Link to="/tournaments">
            <Button className="bg-sportyfi-orange hover:bg-red-600 text-white">
              Explore All Tournaments
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TournamentsSection;
