
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '@/integrations/supabase/client';
import MatchCard from '@/components/match/MatchCard';

interface MatchesListProps {
  matches: Match[];
}

const MatchesList: React.FC<MatchesListProps> = ({ matches }) => {
  const navigate = useNavigate();

  const handleWatchMatches = () => {
    navigate('/watch');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard 
          key={match.id}
          match={match}
          onWatchMatch={handleWatchMatches}
        />
      ))}
    </div>
  );
};

export default MatchesList;
