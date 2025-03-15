
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
      // First try to copy to clipboard - most reliable method across all devices
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
        
        // On mobile, also try to use the share API if available
        if (canShare && isMobile) {
          try {
            const shareData = { title, text, url };
            if (navigator.canShare(shareData)) {
              await navigator.share(shareData);
            }
          } catch (shareError) {
            console.log('Native sharing attempted but not critical if it fails');
            // Ignore share errors since we already copied to clipboard
          }
        }
        
        return true;
      }
      // If clipboard fails, try native sharing (mobile)
      else if (canShare) {
        const shareData = { title, text, url };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast({
            title: "Shared successfully!",
            description: "The content has been shared.",
          });
          return true;
        } else {
          throw new Error('Content cannot be shared');
        }
      } 
      // Last resort - alert the user to copy manually
      else {
        toast({
          title: "Cannot share automatically",
          description: "Please copy this link manually: " + url,
          duration: 5000,
        });
        return false;
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
