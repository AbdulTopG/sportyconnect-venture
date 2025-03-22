
/**
 * Utility functions for image optimization
 */

/**
 * Adds quality and format parameters to Unsplash URLs for optimization
 * @param url The original Unsplash image URL
 * @param width Desired width in pixels
 * @param quality Image quality (0-100)
 * @param format Image format ('webp', 'jpg', etc)
 * @returns Optimized image URL
 */
export function optimizeUnsplashUrl(
  url: string,
  width: number = 800,
  quality: number = 80,
  format: 'webp' | 'jpg' | 'auto' = 'webp'
): string {
  if (!url.includes('unsplash.com')) {
    return url;
  }

  // Parse the URL to separate the base from query parameters
  const [baseUrl, existingParams] = url.split('?');
  
  // Create a URLSearchParams object with existing parameters
  const params = new URLSearchParams(existingParams || '');
  
  // Add or update optimization parameters
  params.set('w', width.toString());
  params.set('q', quality.toString());
  params.set('fm', format);
  params.set('auto', 'compress');
  
  // Return the optimized URL
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Creates a responsive image srcset for different viewport sizes
 * @param baseUrl The base image URL
 * @param widths Array of widths to generate
 * @param format Image format
 * @returns A srcset string
 */
export function createResponsiveSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 960, 1280, 1920],
  format: 'webp' | 'jpg' = 'webp'
): string {
  if (!baseUrl) return '';
  
  return widths
    .map(width => `${optimizeUnsplashUrl(baseUrl, width, 80, format)} ${width}w`)
    .join(', ');
}

/**
 * Gets appropriate image dimensions for an avatar based on device size
 * @param isMobile Whether the device is mobile
 * @returns The appropriate dimensions
 */
export function getAvatarDimensions(isMobile: boolean): { width: number; height: number } {
  return isMobile ? { width: 96, height: 96 } : { width: 128, height: 128 };
}
