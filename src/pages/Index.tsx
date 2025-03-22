
import { useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import SportCategories from '@/components/home/SportCategories';
import MatchesSection from '@/components/home/MatchesSection';
import TournamentsSection from '@/components/home/TournamentsSection';
import StatsFeatures from '@/components/home/StatsFeatures';
import AppFeatures from '@/components/home/AppFeatures';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow">
        <HeroSection />
        <SportCategories />
        <MatchesSection />
        <TournamentsSection />
        <StatsFeatures />
        <AppFeatures />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
