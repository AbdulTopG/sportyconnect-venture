
import React from 'react';

interface VideoPlayerProps {
  match: {
    streamUrl: string;
    title: string;
    viewers: number;
    sport: string;
    teams: { home: string; away: string };
    score: { home: number; away: number };
  } | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ match }) => {
  if (!match) {
    return (
      <div className="mb-6 p-12 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-500">Select a match to watch</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-black">
        <iframe 
          src={match.streamUrl} 
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={match.title}
        />
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-bold">{match.title}</h2>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
            LIVE
          </span>
          <span className="mx-2">•</span>
          <span>{match.viewers.toLocaleString()} viewers</span>
          <span className="mx-2">•</span>
          <span>{match.sport}</span>
        </div>
        
        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="font-semibold">{match.teams.home}</div>
            <div className="text-lg font-bold">{match.score.home} - {match.score.away}</div>
            <div className="font-semibold">{match.teams.away}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
