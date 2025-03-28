
import React from 'react';
import UpcomingMatchCard from './UpcomingMatchCard';

interface UpcomingMatchesListProps {
  matches: any[];
  onToggleReminder: (matchId: string) => void;
}

const UpcomingMatchesList: React.FC<UpcomingMatchesListProps> = ({ matches, onToggleReminder }) => {
  if (matches.length === 0) {
    return <p className="text-center py-8 text-gray-500">No upcoming matches scheduled</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map(match => (
        <UpcomingMatchCard 
          key={match.id} 
          match={match} 
          onToggleReminder={() => onToggleReminder(match.id)}
        />
      ))}
    </div>
  );
};

export default UpcomingMatchesList;
