
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
  const [canCopy, setCanCopy] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check for share capability
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

    // Check for clipboard capability
    try {
      setCanCopy(
        typeof navigator !== 'undefined' && 
        !!navigator.clipboard && 
        typeof navigator.clipboard.writeText === 'function'
      );
    } catch (error) {
      console.error('Error checking clipboard support:', error);
      setCanCopy(false);
    }
  }, []);

  const shareContent = async (url: string, options: ShareOptions = {}) => {
    const { title = 'Check this out', text = 'I thought you might like this', fallbackToClipboard = true } = options;
    
    setIsSharing(true);
    
    try {
      // Try clipboard first - most reliable across browsers/devices
      if (canCopy) {
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
          });
          
          // If on mobile and share is available, also offer native sharing
          if (canShare && isMobile) {
            try {
              const shareData = { title, text, url };
              if (navigator.canShare(shareData)) {
                await navigator.share(shareData);
              }
            } catch (shareError) {
              console.log('Native sharing attempted but not critical if it fails');
              // Already notified user via clipboard toast
            }
          }
          
          return true;
        } catch (clipboardError) {
          console.error('Clipboard access error:', clipboardError);
          // If clipboard fails, try native sharing next
        }
      }
      
      // Try native sharing if clipboard isn't available or failed
      if (canShare) {
        try {
          const shareData = { title, text, url };
          
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            toast({
              title: "Shared successfully!",
              description: "The content has been shared.",
            });
            return true;
          }
        } catch (shareError) {
          console.error('Share API error:', shareError);
          // Try manual fallback next
        }
      }
      
      // Last resort - inform user to copy manually
      toast({
        title: "Cannot share automatically",
        description: "Please copy this link manually: " + url,
        duration: 5000,
      });
      
      return false;
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
    canShare,
    canCopy
  };
};
