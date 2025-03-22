
import React from 'react';
import MatchCard from './MatchCard';
import { Match } from '@/integrations/supabase/client';

interface MatchesListProps {
  matches: Match[];
}

const MatchesList = ({ matches }: MatchesListProps) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matches available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};

export default MatchesList;
