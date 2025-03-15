
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareOptions {
  title?: string;
  text?: string;
  fallbackToClipboard?: boolean;
}

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      setCanShare(
        typeof navigator !== 'undefined' && 
        !!navigator.share && 
        typeof navigator.canShare === 'function'
      );
    } catch (error) {
      console.error('Error checking share support:', error);
      setCanShare(false);
    }
  }, []);

  const shareContent = async (url: string, options: ShareOptions = {}) => {
    const { title = 'Check this out', text = 'I thought you might like this', fallbackToClipboard = true } = options;
    
    setIsSharing(true);
    
    try {
      // Try to use clipboard API as the primary method for all devices
      if (fallbackToClipboard) {
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
          });
          
          // Only try native sharing on mobile if clipboard succeeded
          if (canShare && isMobile) {
            const shareData = { title, text, url };
            
            if (navigator.canShare(shareData)) {
              await navigator.share(shareData);
            }
          }
          
          return true;
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          
          // If clipboard fails and we can use native sharing, try that
          if (canShare) {
            const shareData = { title, text, url };
            
            if (navigator.canShare(shareData)) {
              await navigator.share(shareData);
              return true;
            }
          }
          
          // If we get here, both methods failed
          throw new Error('Unable to share or copy content');
        }
      } else if (canShare) {
        // Direct sharing without clipboard fallback
        const shareData = { title, text, url };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return true;
        } else {
          throw new Error('Content cannot be shared');
        }
      } else {
        throw new Error('Sharing not supported');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      
      toast({
        title: "Sharing failed",
        description: "Could not share or copy the link. Try manually copying the URL.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  return {
    shareContent,
    isSharing,
    canShare
  };
};
