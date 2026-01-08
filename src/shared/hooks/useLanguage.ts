/**
 * useLanguage Hook - Language Management
 * Single Responsibility: Only handles language-related logic
 */

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL, SupportedLanguage, APP_CONFIG } from '../../core/config/app.config';

interface Language {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'dz', name: 'الدارجة', flag: '🇩🇿' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

interface UseLanguageResult {
  currentLanguage: string;
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  languages: Language[];
  changeLanguage: (langCode: string) => void;
  t: (key: string) => string;
}

export const useLanguage = (): UseLanguageResult => {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const currentIsRTL = isRTL(currentLanguage);
  const direction = currentIsRTL ? 'rtl' : 'ltr';

  const changeLanguage = useCallback((langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    
    // Update document direction
    document.documentElement.dir = isRTL(langCode) ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  }, [i18n]);

  return useMemo(() => ({
    currentLanguage,
    isRTL: currentIsRTL,
    direction,
    languages: LANGUAGES,
    changeLanguage,
    t,
  }), [currentLanguage, currentIsRTL, direction, changeLanguage, t]);
};

export default useLanguage;
