
import React from 'react';
import RecordedMatchCard from './RecordedMatchCard';

interface RecordedMatchesListProps {
  matches: any[];
}

const RecordedMatchesList: React.FC<RecordedMatchesListProps> = ({ matches }) => {
  if (matches.length === 0) {
    return <p className="text-center py-8 text-gray-500">No recorded matches available</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map(match => (
        <RecordedMatchCard 
          key={match.id} 
          match={match}
        />
      ))}
    </div>
  );
};

export default RecordedMatchesList;
