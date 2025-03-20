
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  webpSrc?: string;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'custom';
  width?: number;
  height?: number;
  priority?: boolean;
}

export const ResponsiveImage = ({
  src,
  alt,
  fallbackSrc,
  webpSrc,
  sizes = '100vw',
  className,
  containerClassName,
  aspectRatio = 'custom',
  width,
  height,
  priority = false,
  ...props
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Default aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    custom: '',
  };

  // Determine final image source
  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  // Get proper width descriptors for srcSet
  const generateSrcSet = (imgSrc: string) => {
    if (!imgSrc) return undefined;
    
    // Generate basic responsive sizes
    return `${imgSrc} 640w, ${imgSrc} 750w, ${imgSrc} 828w, ${imgSrc} 1080w, ${imgSrc} 1200w, ${imgSrc} 1920w, ${imgSrc} 2048w`;
  };

  return (
    <div className={cn(
      "overflow-hidden relative",
      aspectRatio !== 'custom' && aspectRatioClasses[aspectRatio],
      containerClassName
    )}>
      {webpSrc ? (
        <picture>
          <source 
            srcSet={generateSrcSet(webpSrc)} 
            type="image/webp" 
            sizes={sizes} 
          />
          <source 
            srcSet={generateSrcSet(imageSrc)} 
            type="image/jpeg" 
            sizes={sizes} 
          />
          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              "w-full h-full object-cover",
              className
            )}
            {...props}
          />
        </picture>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            "w-full h-full object-cover",
            className
          )}
          sizes={sizes}
          srcSet={generateSrcSet(imageSrc)}
          {...props}
        />
      )}
    </div>
  );
};

export default ResponsiveImage;
