
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useShare } from '@/hooks/use-share';
import { Match } from '@/integrations/supabase/client';

export const useMatchShare = (match: Match | null) => {
  const { shareContent, isSharing } = useShare();
  
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = match ? `${match.sport} Match` : 'Sport Match';
    const shareText = match ? `Join me for a ${match.sport} match at ${match.location}!` : 'Join me for a match!';
    
    await shareContent(shareUrl, {
      title: shareTitle,
      text: shareText,
      fallbackToClipboard: true
    });
  };

  return {
    handleShare,
    isSharing
  };
};
