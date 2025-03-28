
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 bg-sportyfi-orange text-white">
      <div className="sportyfi-container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Play?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join SportyFi today and connect with athletes in your area. Host matches, join tournaments, and showcase your skills!
        </p>
        <Link to="/signup">
          <Button className="bg-white text-sportyfi-orange hover:bg-gray-100 font-semibold px-6 py-6 h-auto text-lg">
            Create Your Account
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
