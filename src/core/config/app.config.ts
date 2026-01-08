/**
 * Application Configuration
 * Single Responsibility: Only handles app configuration
 */

export const APP_CONFIG = {
  name: 'Djellaba El Basma',
  version: '1.0.0',
  defaultLanguage: 'ar',
  supportedLanguages: ['ar', 'dz', 'fr', 'en'] as const,
  rtlLanguages: ['ar', 'dz'] as const,
} as const;

export const API_CONFIG = {
  baseUrl: 'https://web-production-1c70.up.railway.app',
  timeout: 60000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const CLOUDINARY_CONFIG = {
  defaultWidth: 300,
  thumbnailWidth: 100,
  detailWidth: 700,
  quality: 'auto',
  format: 'auto',
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://web.facebook.com/BOUtiqueOUssamAyaaKOub',
  instagram: 'https://www.instagram.com/jellaba_el.basma_maghnia/',
  tiktok: 'https://www.tiktok.com/@jellaba_el.basma',
  whatsapp: 'https://wa.me/213780723779',
  phone: '+213780723779',
} as const;

export type SupportedLanguage = typeof APP_CONFIG.supportedLanguages[number];

export const isRTL = (language: string): boolean => {
  return APP_CONFIG.rtlLanguages.includes(language as any);
};
