
import React from 'react';
import LiveMatchCard from './LiveMatchCard';

interface LiveMatchesListProps {
  matches: any[];
  onWatchMatch: (match: any) => void;
  selectedMatchId?: string;
}

const LiveMatchesList: React.FC<LiveMatchesListProps> = ({ matches, onWatchMatch, selectedMatchId }) => {
  if (matches.length === 0) {
    return <p className="text-center py-8 text-gray-500">No live matches at the moment</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map(match => (
        <LiveMatchCard 
          key={match.id} 
          match={match} 
          onWatch={() => onWatchMatch(match)}
          isSelected={selectedMatchId === match.id}
        />
      ))}
    </div>
  );
};

export default LiveMatchesList;
