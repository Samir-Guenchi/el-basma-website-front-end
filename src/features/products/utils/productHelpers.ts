/**
 * Product Helpers - Utility functions for products
 * Single Responsibility: Only product-related utility functions
 */

import { API_CONFIG, CLOUDINARY_CONFIG } from '../../../core/config/app.config';

/**
 * Parse images field (can be JSON array or single path)
 */
export const parseImages = (imagesField: string | string[] | undefined): string[] => {
  if (!imagesField) return [];
  
  if (Array.isArray(imagesField)) return imagesField;
  
  if (typeof imagesField === 'string') {
    if (imagesField.startsWith('[')) {
      try {
        return JSON.parse(imagesField);
      } catch {
        return [imagesField];
      }
    }
    return [imagesField];
  }
  
  return [];
};

/**
 * Parse JSON field safely
 */
export const parseJsonField = <T>(field: string | T | undefined, defaultValue: T): T => {
  if (!field) return defaultValue;
  if (typeof field !== 'string') return field;
  
  try {
    return JSON.parse(field);
  } catch {
    return defaultValue;
  }
};

/**
 * Get full image URL from path
 */
export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/placeholder-product.jpg';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_CONFIG.baseUrl}${cleanPath}`;
};

/**
 * Get optimized Cloudinary URL
 */
export const getOptimizedImageUrl = (
  url: string, 
  width: number = CLOUDINARY_CONFIG.defaultWidth
): string => {
  if (!url) return '';
  
  if (url.includes('cloudinary.com')) {
    return url.replace(
      '/upload/', 
      `/upload/w_${width},q_${CLOUDINARY_CONFIG.quality},f_${CLOUDINARY_CONFIG.format},dpr_auto/`
    );
  }
  
  return url;
};

/**
 * Get thumbnail URL
 */
export const getThumbnailUrl = (url: string): string => {
  if (!url) return '';
  
  if (url.includes('cloudinary.com')) {
    return url.replace(
      '/upload/', 
      `/upload/w_${CLOUDINARY_CONFIG.thumbnailWidth},h_${CLOUDINARY_CONFIG.thumbnailWidth},c_fill,q_auto,f_auto/`
    );
  }
  
  return url;
};

/**
 * Format price with locale
 */
export const formatPrice = (price: number, locale: string = 'ar-DZ'): string => {
  return new Intl.NumberFormat(locale).format(price);
};

/**
 * Color name to hex mapping
 */
const COLOR_MAP: Record<string, string> = {
  'noir': '#1a1a1a',
  'noire': '#1a1a1a',
  'black': '#1a1a1a',
  'blanc': '#ffffff',
  'blanche': '#ffffff',
  'white': '#ffffff',
  'rouge': '#dc2626',
  'red': '#dc2626',
  'bleu': '#2563eb',
  'blue': '#2563eb',
  'vert': '#16a34a',
  'green': '#16a34a',
  'jaune': '#eab308',
  'yellow': '#eab308',
  'rose': '#ec4899',
  'pink': '#ec4899',
  'violet': '#7c3aed',
  'purple': '#7c3aed',
  'orange': '#f97316',
  'marron': '#78350f',
  'brown': '#78350f',
  'gris': '#6b7280',
  'grey': '#6b7280',
  'beige': '#d4b896',
  'doré': '#d4af37',
  'gold': '#d4af37',
  'argent': '#c0c0c0',
  'silver': '#c0c0c0',
  'bordeaux': '#722f37',
  'burgundy': '#722f37',
  'turquoise': '#40e0d0',
  'corail': '#ff7f50',
  'coral': '#ff7f50',
  'kaki': '#bdb76b',
  'khaki': '#bdb76b',
};

/**
 * Get hex color from color name
 */
export const getColorHex = (colorName: string): string => {
  const lowerColor = colorName.toLowerCase().trim();
  return COLOR_MAP[lowerColor] || '#ddd';
};
