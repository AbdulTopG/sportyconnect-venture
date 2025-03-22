
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';

import MatchInfo from '@/components/match/MatchInfo';
import MatchActions from '@/components/match/MatchActions';
import HostInfo from '@/components/match/HostInfo';
import ParticipantsList from '@/components/match/ParticipantsList';
import LoadingState from '@/components/match/LoadingState';
import ErrorState from '@/components/match/ErrorState';

import { useMatchDetail } from '@/hooks/use-match-detail';
import { useMatchShare } from '@/hooks/use-match-share';

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Add debugging for when the component mounts and for the id param
  useEffect(() => {
    console.log('MatchDetailPage mounted with ID:', id);
  }, [id]);
  
  const {
    match,
    participants,
    host,
    isLoading,
    error,
    isJoining,
    userIsParticipant,
    matchIsFull,
    isHost,
    handleJoinMatch,
    handleLeaveMatch
  } = useMatchDetail(id);

  const { handleShare, isSharing } = useMatchShare(match);

  // Add more debugging information
  useEffect(() => {
    console.log('Match detail data:', { 
      matchLoaded: !!match, 
      participantsCount: participants?.length || 0,
      hostLoaded: !!host,
      isLoading, 
      error
    });
  }, [match, participants, host, isLoading, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <LoadingState message={`Loading match ${id}...`} />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <ErrorState error={error} navigate={navigate} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 sportyfi-card">
              <MatchInfo match={match} />
              
              <MatchActions
                match={match}
                userIsParticipant={userIsParticipant}
                isJoining={isJoining}
                matchIsFull={matchIsFull}
                isHost={isHost}
                isSharing={isSharing}
                handleJoinMatch={handleJoinMatch}
                handleLeaveMatch={handleLeaveMatch}
                handleShare={handleShare}
              />
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <HostInfo host={host} />
              <ParticipantsList participants={participants} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchDetailPage;
